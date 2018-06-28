const mongoose = require('mongoose');
const { expect } = require('chai');
const { DB_URL } = require('../config');
const seedDb = require('../db/seed/seed');
const seedData = require('../db/seed/testData');


describe('seedDb()', () => {
  let topicDocs;
  before(() => {
    return mongoose.connect(DB_URL)
      .then(() => {
        return seedDb(seedData);
      })
      .then(testTopics => {
        topicDocs = testTopics;
      })
      .catch(console.error);
  });

  after(() => {
    return mongoose.disconnect();
  });

  describe('Topics', () => {
    it('returns seeded topic data', () => {
      const testTopic = topicDocs[0].toObject();
      const topicIdIsvalid = mongoose.Types.ObjectId.isValid(testTopic._id);
      
      expect(topicDocs).to.have.lengthOf(2);
      expect(testTopic).to.include.keys('_id', 'title', 'slug');
      expect(topicIdIsvalid).to.be.true;
      expect(testTopic.title).to.equal('Mitch');
      expect(testTopic.slug).to.equal('mitch');
    });
  });
});