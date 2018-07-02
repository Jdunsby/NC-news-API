process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const { expect } = require('chai');

describe('API', () => {
  describe('GET /', () => {
    it('responds with a welcome object', () => {
      return request
        .get('/')
        .expect(200)
        .then(({ body }) => expect(body).to.have.key('welcome'));
    });
  });
});