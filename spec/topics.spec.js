process.env.NODE_ENV = 'test';

const app = require('../app');
const request = require('supertest')(app);
const { expect } = require('chai');
const mongoose = require('mongoose');

describe.only('/api/topics', () => {
  after(() => mongoose.disconnect());

  it('responds with ', () => {
    request
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body).to.have.all.keys('topics');
        expect(body.topics).to.be.an('array');
        const testTopic = body.topics[0];
        expect(testTopic).to.include.all.keys('_id', 'title', 'slug');
        expect(testTopic.title).to.equal('Mitch');
        expect(testTopic.slug).to.equal('mitch');
      });
  });
});