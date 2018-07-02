process.env.NODE_ENV = 'test';

const app = require('../app');
const request = require('supertest')(app);
const { expect } = require('chai');
const seedDB = require('../db/seed/seed');
const testData = require('../db/seed/testData');

describe('API - COMMENTS', () => {
  let userDocs, articleDocs, commentDocs;
  beforeEach(() => {
    return seedDB(testData)
      .then(docs => {
        [ userDocs, articleDocs, commentDocs ] = docs.slice(1);

      })
      .catch(console.error);
  });

  describe('GET /api/articles/:article_id/comments', () => {
    it('responds with the specified article`s comments', () => {
      return request
        .get(`/api/articles/${articleDocs[0]._id}/comments`)
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.key('comments');
          expect(body.comments).to.be.an('array');
          const [ testComment ] = body.comments;
          expect(testComment).to.include.all.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
          expect(testComment._id).to.equal(`${commentDocs[0]._id}`);
          expect(testComment.body).to.equal(commentDocs[0].body);
          expect(testComment.votes).to.equal(commentDocs[0].votes);
          expect(`${testComment.belongs_to}`).to.equal(`${articleDocs[0]._id}`);
          expect(`${testComment.created_by}`).to.equal(`${userDocs[1]._id}`);
        });
    });

    it('Error: responds with a 400 error when request contains an invalid article_id', () => {
      return request
        .get('/api/articles/sharan/comments')
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('CastError');
          expect(body.message).to.equal('Cast to ObjectId failed for value "sharan" at path "belongs_to" for model "comments"');
        });
    });

    it('Error: responds with a 404 error when passed a valid article_id that doesn`t exist', () => {
      return request
        .get('/api/articles/507f191e810c19729de860ea/comments')
        .expect(404)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(404);
          expect(body.error).to.equal('Not Found');
          expect(body.message).to.equal('There are no comments for article: 507f191e810c19729de860ea');
        });
    });
  });
});