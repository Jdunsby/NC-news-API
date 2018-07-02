process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const { expect } = require('chai');
const apiRootData = require('../db/api-root-data');

describe('API', () => {
  describe('GET /', () => {
    it('responds with a welcome object', () => {
      return request
        .get('/')
        .expect(200)
        .then(({ body }) => expect(body).to.have.key('welcome'));
    });
  });

  describe('GET /api', () => {
    it('responds with an api contents object', () => {
      return request
        .get('/api')
        .expect(200)
        .then(({ body }) => expect(body).to.eql(apiRootData));
    });
  });
});