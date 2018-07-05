process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const { expect } = require('chai');
const { DB_URL } = require('../config');
const seedDB = require('../db/seed/seed');
const { userData, topicData, articleData, commentData } = require('../db/seed/testData');


describe('seedDB()', () => {
  let topicDocs, userDocs, articleDocs, commentDocs;
  before(() => {
    return mongoose.connect(DB_URL)
      .then(() => {
        return seedDB(userData, topicData, articleData, commentData);
      })
      .then(testData => {
        [topicDocs, userDocs, articleDocs, commentDocs] = testData;
      })
      .catch(console.error);
  });
  
  after(() => {
    return mongoose.disconnect();
  });

  describe('Topics', () => {
    it('returns seeded topic data', () => {
      const testTopic = topicDocs[0].toObject();
      const topicIdIsValid = mongoose.Types.ObjectId.isValid(testTopic._id);
      
      expect(topicDocs).to.have.lengthOf(2);
      expect(testTopic).to.include.keys('_id', 'title', 'slug');
      expect(topicIdIsValid).to.be.true;
      expect(testTopic.title).to.equal('Mitch');
      expect(testTopic.slug).to.equal('mitch');
    });
  });

  describe('Users', () => {
    it('returns seeded user data', () => {
      const testUser = userDocs[0].toObject();
      const userIdIsValid = mongoose.Types.ObjectId.isValid(testUser._id);
      
      expect(userDocs).to.have.lengthOf(2);
      expect(testUser).to.include.keys('_id', 'name', 'username', 'avatar_url');
      expect(userIdIsValid).to.be.true;
      expect(testUser.name).to.equal('jonny');
      expect(testUser.username).to.equal('butter_bridge');
      expect(testUser.avatar_url).to.equal('https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg');
    });
  });

  describe('Articles', () => {
    it('returns seeded article data', () => {
      const testArticle = articleDocs[0].toObject();
      const articleIdIsValid = mongoose.Types.ObjectId.isValid(testArticle._id);
      
      expect(articleDocs).to.have.lengthOf(4);
      expect(testArticle).to.include.keys('_id', 'title', 'body', 'belongs_to', 'created_by', 'created_at', 'votes');
      expect(articleIdIsValid).to.be.true;
      expect(testArticle.title).to.equal('Living in the shadow of a great man');
      expect(testArticle.body).to.equal('I find this existence challenging');
      expect(testArticle.belongs_to).to.eql(topicDocs[0]._id);
      expect(testArticle.created_by).to.eql(userDocs[0]._id);
      expect(testArticle.created_at).to.be.an.instanceOf(Date);
    });
  });

  describe('Comments', () => {
    it('returns seeded comment data', () => {
      const testComment = commentDocs[0].toObject();
      const commentIdIsValid = mongoose.Types.ObjectId.isValid(testComment._id);
      
      expect(commentDocs).to.have.lengthOf(8);
      expect(testComment).to.include.keys('_id', 'body', 'belongs_to', 'created_by', 'created_at', 'votes');
      expect(commentIdIsValid).to.be.true;
      expect(testComment.body).to.equal('Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — on you it works.');
      expect(testComment.belongs_to).to.eql(articleDocs[0]._id);
      expect(testComment.created_by).to.eql(userDocs[1]._id);
      expect(testComment.created_at).to.be.an.instanceOf(Date);
    });
  });
});