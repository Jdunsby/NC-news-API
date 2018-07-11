process.env.NODE_ENV = 'test';

const app = require('../app');
const request = require('supertest')(app);
const { expect } = require('chai');
const seedDB = require('../db/seed/seed');
const { userData, topicData, articleData, commentData } = require('../db/seed/testData');

describe('API - COMMENTS', () => {
  let userDocs, articleDocs, commentDocs;
  beforeEach(() => {
    return seedDB(userData, topicData, articleData, commentData)
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
          expect(testComment.created_by).to.be.an('object');
          expect(testComment.created_by._id).to.equal(`${userDocs[1]._id}`);
          expect(testComment.created_by.name).to.equal(userDocs[1].name);
          expect(testComment.created_by.username).to.equal(userDocs[1].username);
          expect(testComment.created_by.avatar_url).to.equal(userDocs[1].avatar_url);        });
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

  describe('POST /api/articles/:article_id/comments', () => {
    it('responds with the successfully posted comment', () => {
      const newComment = {
        body: 'Nice article!',
        created_by: `${userDocs[0]._id}`
      };
      return request
        .post(`/api/articles/${articleDocs[0]._id}/comments`)
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body).to.have.key('comment');
          expect(body.comment).to.be.an('object');
          expect(body.comment).to.include.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
          expect(body.comment.body).to.equal(newComment.body);
          expect(body.comment.votes).to.equal(0);
          expect(body.comment.belongs_to).to.equal(`${articleDocs[0]._id}`);
          expect(body.comment.created_by).to.be.an('object');
          expect(body.comment.created_by._id).to.equal(`${userDocs[0]._id}`);
          expect(body.comment.created_by.name).to.equal(userDocs[0].name);
          expect(body.comment.created_by.username).to.equal(userDocs[0].username);
          expect(body.comment.created_by.avatar_url).to.equal(userDocs[0].avatar_url);
        });
    });

    it('Error: responds with a 400 error when request contains an invalid topic_slug', () => {
      const newArticle = {
        title: 'The second of many API posts',
        body: 'Don`t forget to handle your errors!',
        created_by: `${userDocs[0]._id}`
      };
      return request
        .post('/api/articles/arteon/comments')
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('CastError');
          expect(body.message).to.equal('Cast to ObjectId failed for value "arteon" at path "_id" for model "articles"');
        });
    });

    it('Error: responds with a 404 error when passed a valid topic_slug that doesn`t exist', () => {
      const newComment = {
        body: 'Nice article!',
        created_by: `${userDocs[0]._id}`
      };
      return request
        .post('/api/articles/507f191e810c19729de860ea/comments')
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(404);
          expect(body.error).to.equal('Not Found');
          expect(body.message).to.equal('Article with ID 507f191e810c19729de860ea does not exist');
        });
    });
    
    it('Error: responds with a 400 error when request body has no body property', () => {
      const newComment = {
        created_by: `${userDocs[1]._id}`
      };
      return request
        .post(`/api/articles/${articleDocs[1]._id}/comments`)
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('ValidationError');
          expect(body.message).to.equal('comments validation failed: body: Path `body` is required.');
        });
    });

    it('Error: responds with a 400 error when request body has no created_by property', () => {
      const newComment = {
        body: 'Nice article!'
      };
      return request
        .post(`/api/articles/${articleDocs[0]._id}/comments`)
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('Bad Request');
          expect(body.message).to.equal('\'created_by\' value \'undefined\' is an invalid user ID');
        });
    });
    
    it('Error: responds with a 400 error when request body`s created_by property is not a vaid mongo ID', () => {
      const newComment = {
        body: 'Be water my friend.',
        created_by: 'Bruce Lee'
      };
      return request
        .post(`/api/articles/${articleDocs[0]._id}/comments`)
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('Bad Request');
          expect(body.message).to.equal('\'created_by\' value \'Bruce Lee\' is an invalid user ID');
        });
    });

    it('Error: responds with a 404 error when request body`s created_by property is a valid mongo ID but does not refer to an existing user', () => {
      const newComment = {
        body: 'Be water my friend.',
        created_by: '507f191e810c19729de860ea'
      };
      return request
        .post(`/api/articles/${articleDocs[0]._id}/comments`)
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(404);
          expect(body.error).to.equal('Not Found');
          expect(body.message).to.equal('User with ID 507f191e810c19729de860ea does not exist');
        });
    });
  });

  describe('PUT /api/comments/:article_id', () => {
    it('increases the specified comment`s vote property by 1 when vote query has the value `up`', () => {
      return request
        .put(`/api/comments/${commentDocs[0]._id}?vote=up`)
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.key('comment');
          expect(body.comment).to.be.an('object');
          expect(body.comment).to.include.all.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
          expect(body.comment._id).to.equal(`${commentDocs[0]._id}`);
          expect(body.comment.title).to.equal(commentDocs[0].title);
          expect(body.comment.body).to.equal(commentDocs[0].body);
          expect(body.comment.votes).to.equal(commentDocs[0].votes + 1);
          expect(body.comment.belongs_to).to.equal(`${articleDocs[0]._id}`);
          expect(body.comment.created_by).to.equal(`${userDocs[1]._id}`);
          return request.get(`/api/articles/${articleDocs[0]._id}/comments`);
        })
        .then(({ body }) => {
          expect(body).to.have.key('comments');
          expect(body.comments).to.be.an('array');
          const testComment = body.comments[0];
          expect(testComment).to.be.an('object');
          expect(testComment).to.include.key('votes');
          expect(testComment.votes).to.equal(commentDocs[0].votes + 1);
        });
    });

    it('decreases the specified comment`s vote property by 1 when vote query has the value `down`', () => {
      return request
        .put(`/api/comments/${commentDocs[0]._id}?vote=down`)
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.key('comment');
          expect(body.comment).to.be.an('object');
          expect(body.comment).to.include.all.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
          expect(body.comment._id).to.equal(`${commentDocs[0]._id}`);
          expect(body.comment.title).to.equal(commentDocs[0].title);
          expect(body.comment.body).to.equal(commentDocs[0].body);
          expect(body.comment.votes).to.equal(commentDocs[0].votes - 1);
          expect(body.comment.belongs_to).to.equal(`${articleDocs[0]._id}`);
          expect(body.comment.created_by).to.equal(`${userDocs[1]._id}`);
          return request.get(`/api/articles/${articleDocs[0]._id}/comments`);
        })
        .then(({ body }) => {
          expect(body).to.have.key('comments');
          expect(body.comments).to.be.an('array');
          const testComment = body.comments[0];
          expect(testComment).to.be.an('object');
          expect(testComment).to.include.key('votes');
          expect(testComment.votes).to.equal(commentDocs[0].votes - 1);
        });
    });

    it('Error: responds with a 400 error when request query vote has an invalid value', () => {
      return request
        .put(`/api/comments/${commentDocs[0]._id}?vote=left`)
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
        .put(`/api/comments/${articleDocs[0]._id}?direction=up`)
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
        .put(`/api/comments/${articleDocs[0]._id}`)
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('Bad Request');
          expect(body.message).to.equal('PUT request must include vote query with value \'up\' or \'down\'');
        });
    });


    it('Error: responds with a 400 error when request contains an invalid comment_id', () => {
      return request
        .put('/api/comments/up!?vote=up')
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('CastError');
          expect(body.message).to.equal('Cast to ObjectId failed for value "up!" at path "_id" for model "comments"');
        });
    });

    it('Error: responds with a 404 error when passed a valid comment_id that doesn`t exist', () => {
      return request
        .put('/api/comments/507f191e810c19729de860ea?vote=down')
        .expect(404)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(404);
          expect(body.error).to.equal('Not Found');
          expect(body.message).to.equal('Comment not found');
        });
    });
  });

  describe('DELETE /api/comments/:comment_id', () => {
    it('responds with status 204 and deletes the specified comment', () => {
      return request
        .delete(`/api/comments/${commentDocs[0]._id}`)
        .expect(204);
    });

    it('Error: responds with a 400 error when request contains an invalid article_id', () => {
      return request
        .delete('/api/comments/apollo')
        .expect(400)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(400);
          expect(body.error).to.equal('CastError');
          expect(body.message).to.equal('Cast to ObjectId failed for value "apollo" at path "_id" for model "comments"');
        });
    });

    it('Error: responds with a 404 error when passed a valid comment_id that doesn`t exist', () => {
      return request
        .delete('/api/comments/507f191e810c19729de860ea')
        .expect(404)
        .then(({ body }) => {
          expect(body).to.have.all.keys('statusCode', 'error', 'message');
          expect(body.statusCode).to.equal(404);
          expect(body.error).to.equal('Not Found');
          expect(body.message).to.equal('Comment not found');
        });
    });
  });
});