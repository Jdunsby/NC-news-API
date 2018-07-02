process.env.NODE_ENV = 'test';

const app = require('../app');
const request = require('supertest')(app);
const mongoose = require('mongoose');
const { expect } = require('chai');
const seedDB = require('../db/seed/seed');
const testData = require('../db/seed/testData');

describe('API - USERS', () => {
  let userDocs;
  beforeEach(() => {
    return seedDB(testData)
      .then(docs => {
        userDocs = docs[1];
      })
      .catch(console.error);
  });

  after(() => mongoose.disconnect());

  describe('GET /api/users ', () => {
    it('responds with all users', () => {
      return request
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.key('users');
          expect(body.users).to.be.an('array');
          expect(body.users).to.have.lengthOf(userDocs.length);
          const testUser = body.users[0];
          expect(testUser).to.include.all.keys('_id', 'name', 'username', 'avatar_url');
          expect(testUser._id).to.equal(`${userDocs[0]._id}`);
          expect(testUser.name).to.equal(userDocs[0].name);
          expect(testUser.username).to.equal(userDocs[0].username);
          expect(testUser.avatar_url).to.equal(userDocs[0].avatar_url);
        });
    });
  });

  describe('GET /api/users/:user_id', () => {
    it('responds with the requested user', () => {
      return request
        .get(`/api/users/${userDocs[1]._id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.key('user');
          expect(body.user).to.be.an('object');
          expect(body.user).to.include.all.keys('_id', 'name', 'username', 'avatar_url');
          expect(body.user._id).to.equal(`${userDocs[1]._id}`);
          expect(body.user.name).to.equal(userDocs[1].name);
          expect(body.user.username).to.equal(userDocs[1].username);
          expect(body.user.avatar_url).to.equal(userDocs[1].avatar_url);
        });
    });

    it('Error: responds with a 400 error when request contains an invalid user_id', () => {
      return request
        .get('/api/users/lupo')
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('CastError');
          expect(body.message).to.equal('Cast to ObjectId failed for value "lupo" at path "_id" for model "users"');
        });
    });

    it('Error: responds with a 404 error when passed a valid user_id that doesn`t exist', () => {
      return request
        .get('/api/users/507f191e810c19729de860ea')
        .expect(404)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(404);
          expect(body.error).to.equal('Not Found');
          expect(body.message).to.equal('User not found');
        });
    });
  });
});