process.env.NODE_ENV = 'test';

const app = require('../app');
const request = require('supertest')(app);
const mongoose = require('mongoose');
const { expect } = require('chai');
const seedDB = require('../db/seed/seed');
const testData = require('../db/seed/testData');

describe('API', () => {
  describe.only('Topics', () => {
    let topicDocs;
    beforeEach(() => {
      return seedDB(testData)
        .then(docs => {
          [ topicDocs ] = docs;
        })
        .catch(console.error);
    });
  
    after(() => mongoose.disconnect());
  
    it('GET /api/topics responds with all topics', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.key('topics');
          expect(body.topics).to.be.an('array');
          const testTopic = body.topics[0];
          expect(testTopic).to.include.all.keys('_id', 'title', 'slug');
          expect(testTopic._id).to.equal(`${topicDocs[0]._id}`);
          expect(testTopic.title).to.equal(topicDocs[0].title);
          expect(testTopic.slug).to.equal(topicDocs[0].slug);
        });
    });
    it('GET /api/topics/:topic_id responds with the specified topic', () => {
      return request
        .get(`/api/topics/${topicDocs[1]._id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.key('topic');
          expect(body.topic).to.be.an('object');
          expect(body.topic).to.include.all.keys('_id', 'title', 'slug');
          expect(body.topic._id).to.equal(`${topicDocs[1]._id}`);
          expect(body.topic.title).to.equal(topicDocs[1].title);
          expect(body.topic.slug).to.equal(topicDocs[1].slug);
        });
    });
    it('Error: GET /api/topics/:topic_id responds with a 400 error when request contains an invalid topic_id', () => {
      return request
        .get('/api/topics/something')
        .expect(400)
        .then(({body}) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('CastError');
          expect(body.message).to.equal('Cast to ObjectId failed for value "something" at path "_id" for model "topics"');
        });
    });
  });
});