process.env.NODE_ENV = 'test';

const app = require('../app');
const request = require('supertest')(app);
const mongoose = require('mongoose');
const { expect } = require('chai');
const seedDB = require('../db/seed/seed');
const testData = require('../db/seed/testData');

describe('API', () => {
  let topicDocs, userDocs, articleDocs;
  beforeEach(() => {
    return seedDB(testData)
      .then(docs => {
        [topicDocs, userDocs, articleDocs] = docs;
      })
      .catch(console.error);
  });

  after(() => mongoose.disconnect());

  describe('Topics', () => {
    it('GET /api/topics responds with all topics', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.key('topics');
          expect(body.topics).to.be.an('array');
          expect(body.topics).to.have.lengthOf(topicDocs.length);
          const testTopic = body.topics[0];
          expect(testTopic).to.include.all.keys('_id', 'title', 'slug');
          expect(testTopic._id).to.equal(`${topicDocs[0]._id}`);
          expect(testTopic.title).to.equal(topicDocs[0].title);
          expect(testTopic.slug).to.equal(topicDocs[0].slug);
        });
    });

    it('GET /api/topics/:topic_id responds with the requested topic', () => {
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
        .get('/api/topics/polo')
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('CastError');
          expect(body.message).to.equal('Cast to ObjectId failed for value "polo" at path "_id" for model "topics"');
        });
    });

    it('Error: GET /api/topics/:topic_id responds with a 404 error when passed a valid topic_id that doesn`t exist', () => {
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

  describe('Users', () => {
    it('GET /api/users responds with all users', () => {
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

    it('GET /api/users/:user_id responds with the requested user', () => {
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

    it('Error: GET /api/users/:user_id responds with a 400 error when request contains an invalid user_id', () => {
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

    it('Error: GET /api/users/:user_id responds with a 404 error when passed a valid user_id that doesn`t exist', () => {
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

  describe('Articles', () => {
    it('GET /api/articles responds with all articles', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.key('articles');
          expect(body.articles).to.be.an('array');
          expect(body.articles).to.have.lengthOf(articleDocs.length);
          const testArticle = body.articles[0];
          expect(testArticle).to.include.all.keys('_id', 'title', 'body', 'votes', 'created_at', 'belongs_to', 'created_by', 'comment_count');
          expect(testArticle._id).to.equal(`${articleDocs[0]._id}`);
          expect(testArticle.title).to.equal(articleDocs[0].title);
          expect(testArticle.body).to.equal(articleDocs[0].body);
          expect(testArticle.votes).to.equal(articleDocs[0].votes);
          expect(testArticle.belongs_to).to.be.an('object');
          expect(testArticle.belongs_to._id).to.equal(`${topicDocs[0]._id}`);
          expect(testArticle.belongs_to.slug).to.equal(topicDocs[0].slug);
          expect(testArticle.created_by).to.be.an('object');
          expect(testArticle.created_by._id).to.equal(`${userDocs[0]._id}`);
          expect(testArticle.created_by.name).to.equal(userDocs[0].name);
          expect(testArticle.created_by.username).to.equal(userDocs[0].username);
          expect(testArticle.created_by.avatar_url).to.equal(userDocs[0].avatar_url);
          expect(testArticle.comment_count).to.equal(2);
        });
    });

    it('GET /api/articles/:article_id responds with the requested article', () => {
      return request
        .get(`/api/articles/${articleDocs[0]._id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.key('article');
          expect(body.article).to.be.an('object');
          expect(body.article).to.include.all.keys('_id', 'title', 'body', 'votes', 'created_at', 'belongs_to', 'created_by', 'comment_count');
          expect(body.article._id).to.equal(`${articleDocs[0]._id}`);
          expect(body.article.title).to.equal(articleDocs[0].title);
          expect(body.article.body).to.equal(articleDocs[0].body);
          expect(body.article.votes).to.equal(articleDocs[0].votes);
          expect(body.article.belongs_to).to.be.an('object');
          expect(body.article.belongs_to._id).to.equal(`${topicDocs[0]._id}`);
          expect(body.article.belongs_to.slug).to.equal(topicDocs[0].slug);
          expect(body.article.created_by).to.be.an('object');
          expect(body.article.created_by._id).to.equal(`${userDocs[0]._id}`);
          expect(body.article.created_by.name).to.equal(userDocs[0].name);
          expect(body.article.created_by.username).to.equal(userDocs[0].username);
          expect(body.article.created_by.avatar_url).to.equal(userDocs[0].avatar_url);
          expect(body.article.comment_count).to.equal(2);
        });
    });

    it('Error: GET /api/articles/:article_id responds with a 400 error when request contains an invalid article_id', () => {
      return request
        .get('/api/articles/golf')
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('CastError');
          expect(body.message).to.equal('Cast to ObjectId failed for value "golf" at path "_id" for model "articles"');
        });
    });

    it('Error: GET /api/articles/:article_id responds with a 404 error when passed a valid article_id that doesn`t exist', () => {
      return request
        .get('/api/articles/507f191e810c19729de860ea')
        .expect(404)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(404);
          expect(body.error).to.equal('Not Found');
          expect(body.message).to.equal('Article not found');
        });
    });

    it('GET /api/topics/:topic_id/articles responds with articles belonging to the specified topic', () => {
      return request
        .get(`/api/topics/${topicDocs[1]._id}/articles`)
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.key('articles');
          expect(body.articles).to.be.an('array');
          expect(body.articles).to.have.lengthOf(2);
          const testArticle = body.articles[0];
          expect(testArticle).to.include.all.keys('_id', 'title', 'body', 'votes', 'created_at', 'belongs_to', 'created_by', 'comment_count');
          expect(testArticle._id).to.equal(`${articleDocs[2]._id}`);
          expect(testArticle.title).to.equal(articleDocs[2].title);
          expect(testArticle.body).to.equal(articleDocs[2].body);
          expect(testArticle.votes).to.equal(articleDocs[2].votes);
          expect(testArticle.belongs_to).to.be.an('object');
          expect(testArticle.belongs_to._id).to.equal(`${topicDocs[1]._id}`);
          expect(testArticle.belongs_to.slug).to.equal(topicDocs[1].slug);
          expect(testArticle.created_by).to.be.an('object');
          expect(testArticle.created_by._id).to.equal(`${userDocs[0]._id}`);
          expect(testArticle.created_by.name).to.equal(userDocs[0].name);
          expect(testArticle.created_by.username).to.equal(userDocs[0].username);
          expect(testArticle.created_by.avatar_url).to.equal(userDocs[0].avatar_url);
          expect(testArticle.comment_count).to.equal(2);
        });
    });

    it('Error: GET /api/topics/:topic_id/articles responds with a 400 error when request contains an invalid topic_id', () => {
      return request
        .get('/api/topics/passat/articles')
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('CastError');
          expect(body.message).to.equal('Cast to ObjectId failed for value "passat" at path "belongs_to" for model "articles"');
        });
    });

    it('Error: GET /api/topics/:topic_id/articles responds with a 404 error when passed a valid topic_id that doesn`t exist', () => {
      return request
        .get('/api/topics/507f191e810c19729de860ea/articles')
        .expect(404)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(404);
          expect(body.error).to.equal('Not Found');
          expect(body.message).to.equal('Articles not found for topic: 507f191e810c19729de860ea');
        });
    });
  });
});