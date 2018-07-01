process.env.NODE_ENV = 'test';

const app = require('../app');
const request = require('supertest')(app);
const { expect } = require('chai');
const seedDB = require('../db/seed/seed');
const testData = require('../db/seed/testData');

describe('API - ARTICLES', () => {
  let topicDocs, userDocs, articleDocs;
  beforeEach(() => {
    return seedDB(testData)
      .then(docs => {
        [ topicDocs, userDocs, articleDocs ] = docs;
      })
      .catch(console.error);
  });

  describe('GET /api/articles', () => {
    it('responds with all articles', () => {
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
  });

  describe('GET /api/articles/:article_id', () => {
    it('responds with the requested article', () => {
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

    it('Error: responds with a 400 error when request contains an invalid article_id', () => {
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

    it('Error: responds with a 404 error when passed a valid article_id that doesn`t exist', () => {
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
  });

  describe('GET /api/topics/:topic_id/articles', () => {
    it('responds with articles belonging to the specified topic', () => {
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

    it('Error: responds with a 400 error when request contains an invalid topic_id', () => {
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

    it('Error: responds with a 404 error when passed a valid topic_id that doesn`t exist', () => {
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

  describe('POST /api/topics/:topic_id/articles', () => {
    it('responds with the successfully posted article', () => {
      const newArticle = {
        title: 'The first of many API posts',
        body: 'Don`t forget to handle your errors!',
        created_by: `${userDocs[0]._id}`
      };
      return request
        .post(`/api/topics/${topicDocs[0]._id}/articles`)
        .send(newArticle)
        .expect(201)
        .then(({ body }) => {
          expect(body).to.have.key('article');
          expect(body.article).to.be.an('object');
          expect(body.article).to.include.keys('_id', 'title', 'body', 'votes', 'created_at', 'belongs_to', 'created_by', 'comment_count');
          expect(body.article.title).to.equal(newArticle.title);
          expect(body.article.body).to.equal(newArticle.body);
          expect(body.article.votes).to.equal(0);
          expect(body.article.belongs_to).to.be.an('object');
          expect(body.article.belongs_to._id).to.equal(`${topicDocs[0]._id}`);
          expect(body.article.belongs_to.slug).to.equal(topicDocs[0].slug);
          expect(body.article.created_by).to.be.an('object');
          expect(body.article.created_by._id).to.equal(`${userDocs[0]._id}`);
          expect(body.article.created_by.name).to.equal(userDocs[0].name);
          expect(body.article.created_by.username).to.equal(userDocs[0].username);
          expect(body.article.created_by.avatar_url).to.equal(userDocs[0].avatar_url);
          expect(body.article.comment_count).to.equal(0);
        });
    });

    it('Error: responds with a 400 error when request contains an invalid topic_id', () => {
      const newArticle = {
        title: 'The second of many API posts',
        body: 'Don`t forget to handle your errors!',
        created_by: `${userDocs[0]._id}`
      };
      return request
        .post('/api/topics/beetle/articles')
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('CastError');
          expect(body.message).to.equal('Cast to ObjectId failed for value "beetle" at path "_id" for model "topics"');
        });
    });

    it('Error: responds with a 404 error when passed a valid topic_id that doesn`t exist', () => {
      const newArticle = {
        title: 'The third of many API posts',
        body: 'Don`t forget to handle your errors!',
        created_by: `${userDocs[0]._id}`
      };
      return request
        .post('/api/topics/507f191e810c19729de860ea/articles')
        .send(newArticle)
        .expect(404)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(404);
          expect(body.error).to.equal('Not Found');
          expect(body.message).to.equal('Topic with ID 507f191e810c19729de860ea does not exist');
        });
    });

    it('Error: responds with a 400 error when request body has no title property', () => {
      const newArticle = {
        body: 'Don`t forget to handle your errors!',
        created_by: `${userDocs[0]._id}`
      };
      return request
        .post(`/api/topics/${topicDocs[0]._id}/articles`)
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('ValidationError');
          expect(body.message).to.equal('articles validation failed: title: Path `title` is required.');
        });
    });
    
    it('Error: responds with a 400 error when request body has no body property', () => {
      const newArticle = {
        title: 'The third of many API posts',
        created_by: `${userDocs[0]._id}`
      };
      return request
        .post(`/api/topics/${topicDocs[0]._id}/articles`)
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('ValidationError');
          expect(body.message).to.equal('articles validation failed: body: Path `body` is required.');
        });
    });

    it('Error: responds with a 400 error when request body has no created_by property', () => {
      const newArticle = {
        title: 'The third of many API posts',
        body: 'Don`t forget to handle your errors!'
      };
      return request
        .post(`/api/topics/${topicDocs[0]._id}/articles`)
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('Bad Request');
          expect(body.message).to.equal('"created_by" value \'undefined\' is an invalid user ID');
        });
    });
    
    it('Error: responds with a 400 error when request body`s created_by property does not refer to an existing user', () => {
      const newArticle = {
        title: 'The third of many API posts',
        body: 'Don`t forget to handle your errors!',
        created_by: 'Elon Musk'
      };
      return request
        .post(`/api/topics/${topicDocs[0]._id}/articles`)
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('Bad Request');
          expect(body.message).to.equal('"created_by" value \'Elon Musk\' is an invalid user ID');
        });
    });
  });

  describe('PUT /api/articles/:article_id', () => {
    it('increases the specified article`s vote property by 1 when vote query has the value `up`', () => {
      return request
        .put(`/api/articles/${articleDocs[0]._id}?vote=up`)
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.key('article');
          expect(body.article).to.be.an('object');
          expect(body.article).to.include.all.keys('_id', 'title', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
          expect(body.article._id).to.equal(`${articleDocs[0]._id}`);
          expect(body.article.title).to.equal(articleDocs[0].title);
          expect(body.article.body).to.equal(articleDocs[0].body);
          expect(body.article.votes).to.equal(articleDocs[0].votes + 1);
          expect(body.article.belongs_to).to.equal(`${topicDocs[0]._id}`);
          expect(body.article.created_by).to.equal(`${userDocs[0]._id}`);
          return request.get(`/api/articles/${articleDocs[0]._id}`);
        })
        .then(({ body }) => {
          expect(body).to.have.key('article');
          expect(body.article).to.be.an('object');
          expect(body.article).to.include.key('votes');
          expect(body.article.votes).to.equal(articleDocs[0].votes + 1);
        });
    });

    it('decreases the specified article`s vote property by 1 when vote query has the value `down`', () => {
      return request
        .put(`/api/articles/${articleDocs[0]._id}?vote=down`)
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.key('article');
          expect(body.article).to.be.an('object');
          expect(body.article).to.include.all.keys('_id', 'title', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
          expect(body.article._id).to.equal(`${articleDocs[0]._id}`);
          expect(body.article.title).to.equal(articleDocs[0].title);
          expect(body.article.body).to.equal(articleDocs[0].body);
          expect(body.article.votes).to.equal(articleDocs[0].votes - 1);
          expect(body.article.belongs_to).to.equal(`${topicDocs[0]._id}`);
          expect(body.article.created_by).to.equal(`${userDocs[0]._id}`);
          return request.get(`/api/articles/${articleDocs[0]._id}`);
        })
        .then(({ body }) => {
          expect(body).to.have.key('article');
          expect(body.article).to.be.an('object');
          expect(body.article).to.include.key('votes');
          expect(body.article.votes).to.equal(articleDocs[0].votes - 1);
        });
    });

    it('Error: responds with a 400 error when request query vote has an invalid value', () => {
      return request
        .put(`/api/articles/${articleDocs[0]._id}?vote=left`)
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('Bad Request');
          expect(body.message).to.equal('Value \'left\' for vote query is invalid. Use \'up\' or \'down\' instead');
        });
    });
    
    it('Error: responds with a 400 error when request query isn`t vote but has a valid value', () => {
      return request
        .put(`/api/articles/${articleDocs[0]._id}?direction=up`)
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('Bad Request');
          expect(body.message).to.equal('PUT request must include vote query with value \'up\' or \'down\'');
        });
    });
    
    it('Error: responds with a 400 error when request when request doesn`t include vote query', () => {
      return request
        .put(`/api/articles/${articleDocs[0]._id}`)
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('Bad Request');
          expect(body.message).to.equal('PUT request must include vote query with value \'up\' or \'down\'');
        });
    });


    it('Error: responds with a 400 error when request contains an invalid article_id', () => {
      return request
        .put('/api/articles/tiguan?vote=up')
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('CastError');
          expect(body.message).to.equal('Cast to ObjectId failed for value "tiguan" at path "_id" for model "articles"');
        });
    });

    it('Error: responds with a 404 error when passed a valid article_id that doesn`t exist', () => {
      return request
        .get('/api/articles/507f191e810c19729de860ea?vote=down')
        .expect(404)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(404);
          expect(body.error).to.equal('Not Found');
          expect(body.message).to.equal('Article not found');
        });
    });
  });

  describe('DELETE /api/articles/:article_id', () => {
    it('responds with status 204 and deletes the specified article', () => {
      return request
        .delete(`/api/articles/${articleDocs[0]._id}`)
        .expect(204)
        .then(() => {
          return request.get(`/api/articles/${articleDocs[0]._id}`);
        })
        .then(({body}) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(404);
          expect(body.error).to.equal('Not Found');
          expect(body.message).to.equal('Article not found');
        });
    });

    it('Error: responds with a 400 error when request contains an invalid article_id', () => {
      return request
        .get('/api/articles/touran')
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('CastError');
          expect(body.message).to.equal('Cast to ObjectId failed for value "touran" at path "_id" for model "articles"');
        });
    });

    it('Error: responds with a 404 error when passed a valid article_id that doesn`t exist', () => {
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
  });
});