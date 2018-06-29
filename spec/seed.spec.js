const mongoose = require('mongoose');
const { expect } = require('chai');
const { DB_URL } = require('../config');
const seedDb = require('../db/seed/seed');
const seedData = require('../db/seed/testData');


describe('seedDb()', () => {
  let topicDocs, userDocs, articleDocs;
  before(() => {
    return mongoose.connect(DB_URL)
      .then(() => {
        return seedDb(seedData);
      })
      .then(testData => {
        [topicDocs, userDocs, articleDocs] = testData;
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
});