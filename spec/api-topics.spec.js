process.env.NODE_ENV = 'test';

const app = require('../app');
const request = require('supertest')(app);
const { expect } = require('chai');
const seedDB = require('../db/seed/seed');
const { userData, topicData, articleData, commentData } = require('../db/seed/testData');

describe('API - TOPICS', () => {
  let topicDocs;
  beforeEach(() => {
    return seedDB(userData, topicData, articleData, commentData)
      .then(docs => {
        [ topicDocs ] = docs;
      })
      .catch(console.error);
  });

  describe('GET /api/topics', () => {
    it('responds with all topics', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.key('topics');
          expect(body.topics).to.be.an('array');
          expect(body.topics).to.have.lengthOf(topicDocs.length);
          const [ testTopic ] = body.topics;
          expect(testTopic).to.include.all.keys('_id', 'title', 'slug');
          expect(testTopic._id).to.equal(`${topicDocs[0]._id}`);
          expect(testTopic.title).to.equal(topicDocs[0].title);
          expect(testTopic.slug).to.equal(topicDocs[0].slug);
        });
    });
  });

  describe('GET /api/topics/:topic_id ', () => {
    it('responds with the requested topic', () => {
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

    it('Error: responds with a 400 error when request contains an invalid topic_id', () => {
      return request
        .get('/api/topics/polo')
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('CastError');
          expect(body.message).to.equal('Cast to ObjectId failed for value "polo" at path "_id" for model "topics"');
        });
    });

    it('Error: responds with a 404 error when passed a valid topic_id that doesn`t exist', () => {
      return request
        .get('/api/topics/507f191e810c19729de860ea')
        .expect(404)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(404);
          expect(body.error).to.equal('Not Found');
          expect(body.message).to.equal('Topic not found');
        });
    });
  });
});