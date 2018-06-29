process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const { createRef, addRefs } = require('../utils/seeding');

describe('utils', () => {
  describe('createRef()', () => {
    it('returns an empty object when passed an empty array', () => {
      expect(createRef([])).to.be.empty.and.an('object');
    });

    it('returns an object with a single topic reference when passed an array of 1 topic object', () => {
      const testTopics = [{ slug: 'examples', _id: '507f1f77bcf86cd799439011' }];
      const expected = { examples: '507f1f77bcf86cd799439011' };
      expect(createRef(testTopics, 'slug', '_id')).to.eql(expected);
    });

    it('returns an object with a single user reference when passed an array of 1 user object', () => {
      const testTopics = [{ username: 'mitch', _id: '507f1f77bcf86cd799439011' }];
      const expected = { mitch: '507f1f77bcf86cd799439011' };
      expect(createRef(testTopics, 'username', '_id')).to.eql(expected);
    });

    it('returns an object with references corresponding to those in the passed array', () => {
      const animals = [
        { species: 'Human', _id: '507f191e810c19729de860ea' },
        { species: 'Snake', _id: '507f1f77bcf86cd799439011' },
        { species: 'Mitch', _id: '505bd76785ebb509fc183733' }
      ];
      const expected = {
        Human: '507f191e810c19729de860ea',
        Snake: '507f1f77bcf86cd799439011',
        Mitch: '505bd76785ebb509fc183733'
      };
      expect(createRef(animals, 'species', '_id')).to.eql(expected);
    });

    it('ignores any objects in the passed array that don`t have the specified refKey (2nd arg) property', () => {
      const testTopics = [
        { slug: 'coding', _id: '507f191e810c19729de860ea' },
        { title: 'cooking', _id: '507f1f77bcf86cd799439011' },
        { slug: 'fishing', _id: '505bd76785ebb509fc183733' }
      ];
      const expected = {
        coding: '507f191e810c19729de860ea',
        fishing: '505bd76785ebb509fc183733'
      };
      expect(createRef(testTopics, 'slug', '_id')).to.eql(expected);
    });

    it('ignores any objects in the passed array that don`t have the specified refVal (3rd arg) property', () => {
      const testTopics = [
        { slug: 'coding', _id: '507f191e810c19729de860ea' },
        { slug: 'cooking', identity: '507f1f77bcf86cd799439011' },
        { slug: 'fishing', _id: '505bd76785ebb509fc183733' }
      ];
      const expected = {
        coding: '507f191e810c19729de860ea',
        fishing: '505bd76785ebb509fc183733'
      };
      expect(createRef(testTopics, 'slug', '_id')).to.eql(expected);
    });

    it('doesn`t mutate the passed in array', () => {
      const testTopics = [{ slug: 'coding', _id: 'A1' }];
      const topicsCopy = [...testTopics];
      createRef(testTopics, 'slug', '_id');
      expect(testTopics).to.eql(topicsCopy);
    });

    it('doesn`t mutate the objects within the passed array', () => {
      const testTopics = [{ slug: 'coding', _id: 'A1' }];
      const topicCopy = { ...testTopics[0] };
      createRef(testTopics, 'slug', '_id');
      expect(testTopics[0]).to.eql(topicCopy);
    });

    it('returns an empty object when no refKey (2nd arg) or refVal (3rd arg) is passed', () => {
      const animals = [
        { species: 'Human', _id: '507f191e810c19729de860ea' },
        { species: 'Snake', _id: '507f1f77bcf86cd799439011' },
        { species: 'Mitch', _id: '505bd76785ebb509fc183733' }
      ];
      expect(createRef(animals)).to.be.empty.and.an('object');
    });

    it('returns an empty object when no refVal (3rd arg) is passed', () => {
      const animals = [
        { species: 'Human', _id: '507f191e810c19729de860ea' },
        { species: 'Snake', _id: '507f1f77bcf86cd799439011' },
        { species: 'Mitch', _id: '505bd76785ebb509fc183733' }
      ];
      expect(createRef(animals, 'species')).to.be.empty.and.an('object');
    });

    it('returns an empty object when refVal (3rd arg) is not present in any object in the passed collection', () => {
      const animals = [
        { species: 'Human', _id: '507f191e810c19729de860ea' },
        { species: 'Snake', _id: '507f1f77bcf86cd799439011' },
        { species: 'Mitch', _id: '505bd76785ebb509fc183733' }
      ];
      expect(createRef(animals, 'species', 'test')).to.be.empty.and.an('object');
    });

    it('returns a reference object when refKey (2nd arg) is not a string but can be coerced into a valid key', () => {
      const animals = [
        { true: 'Human', _id: '507f191e810c19729de860ea', 0: 'foo'},
        { true: 'Snake', _id: '507f1f77bcf86cd799439011', 0: 'bar'},
        { true: 'Mitch', _id: '505bd76785ebb509fc183733', 0: 'baz'}
      ];
      const expected1 = {
        Human: '507f191e810c19729de860ea',
        Snake: '507f1f77bcf86cd799439011',
        Mitch: '505bd76785ebb509fc183733'
      };
      const expected2 = {
        foo: 'Human',
        bar: 'Snake',
        baz: 'Mitch'
      };
      expect(createRef(animals, true, '_id')).to.eql(expected1);
      expect(createRef(animals, 0, 'true')).to.eql(expected2);
    });

    it('returns a reference object when refVal (3rd arg) is not a string but can be coerced into a valid key', () => {
      const animals = [
        { species: 'Human', null: '507f191e810c19729de860ea', 5: 'foo'},
        { species: 'Snake', null: '507f1f77bcf86cd799439011', 5: 'bar'},
        { species: 'Mitch', null: '505bd76785ebb509fc183733', 5: 'baz'}
      ];
      const expected1 = {
        Human: '507f191e810c19729de860ea',
        Snake: '507f1f77bcf86cd799439011',
        Mitch: '505bd76785ebb509fc183733'
      };
      const expected2 = {
        Human: 'foo',
        Snake: 'bar',
        Mitch: 'baz'
      };
      expect(createRef(animals, 'species', null)).to.eql(expected1);
      expect(createRef(animals, 'species', 5)).to.eql(expected2);
    });
  });


  describe('addrefs()', () => {
    it('returns an empty array if the passed collction (2nd arg) is an empty array', () => {
      const topics = [{ slug: 'examples', _id: '507f1f77bcf86cd799439011' }];
      const topicRef = createRef(topics, 'slug', '_id');
      expect(addRefs(topicRef, [])).to.be.empty.and.an('array');
    });

    it('returns a new array', () => {
      const topics = [{ slug: 'examples', _id: '507f1f77bcf86cd799439011' }];
      const articles = [{ title: 'banana', belongs_to: 'examples' }];
      const topicRef = createRef(topics, 'slug', '_id');
      expect(addRefs(topicRef, articles, 'belongs_to')).to.not.equal(articles);
    });

    it('does not mutate the passed in reference object (1st arg)', () => {
      const topics = [{ slug: 'examples', _id: '507f1f77bcf86cd799439011' }];
      const articles = [{ title: 'banana', belongs_to: 'examples' }];
      const topicRef = createRef(topics, 'slug', '_id');
      const topicRefCopy = { ...topicRef };
      addRefs(topicRef, articles, 'belongs_to');
      expect(topicRef).to.eql(topicRefCopy);
    });

    it('does not mutate the objects in the passed collection (2nd arg)', () => {
      const topics = [{ slug: 'examples', _id: '507f1f77bcf86cd799439011' }];
      const topicRef = createRef(topics, 'slug', '_id');
      const articles = [{ title: 'banana', belongs_to: 'examples' }];
      const articlesCopy = [...articles];
      const newCollectionItem = addRefs(topicRef, articles, 'belongs_to')[0];
      expect(newCollectionItem).to.not.equal(articlesCopy[0]);
      expect(articles).to.have.lengthOf(articlesCopy.length);
    });

    it('replaces the value on the specified replaceKey (3rd arg) of each item with the corresponding reference', () => {
      const topics = [{ slug: 'examples', _id: '507f1f77bcf86cd799439011' }];
      const topicRef = createRef(topics, 'slug', '_id');
      const articles = [{ title: 'banana', belongs_to: 'examples' }];
      const expected = [{ title: 'banana', belongs_to: '507f1f77bcf86cd799439011' }];
      expect(addRefs(topicRef, articles, 'belongs_to')).to.eql(expected);
    });

    it('doesn`t alter any items in the collection that don`t have the replaceKey (3rd arg) as a key', () => {
      const topics = [{ slug: 'examples', _id: '507f1f77bcf86cd799439011' }];
      const topicRef = createRef(topics, 'slug', '_id');
      const articles = [{ title: 'banana' }];
      const expected = [{ title: 'banana' }];
      expect(addRefs(topicRef, articles, 'belongs_to')).to.eql(expected);
    });

    it('doesn`t alter any items whose replaceKey (3rd arg) references have an invalid corresponding reference', () => {
      const topics = [{ slug: 'examples', _id: 'hi' }];
      const topicRef = createRef(topics, 'slug', '_id');
      const articles = [{ title: 'banana', belongs_to: 'examples' }];
      const expected = [{ title: 'banana', belongs_to: 'examples' }];
      expect(addRefs(topicRef, articles, 'belongs_to')).to.eql(expected);
    });

    it('doesn`t alter any items whose replaceKey (3rd arg) reference doesn`t exist', () => {
      const topics = [{ slug: 'examples', _id: '507f1f77bcf86cd799439011' }];
      const topicRef = createRef(topics, 'slug', '_id');
      const articles = [{ title: 'banana', belongs_to: 'liz' }];
      const expected = [{ title: 'banana', belongs_to: 'liz' }];
      expect(addRefs(topicRef, articles, 'belongs_to')).to.eql(expected);
    });
    
    it('returns a copy of the original collection if replaceKey (3rd arg) isn`t specified', () => {
      const topics = [{ slug: 'examples', _id: '507f1f77bcf86cd799439011' }];
      const topicRef = createRef(topics, 'slug', '_id');
      const articles = [{ title: 'banana', belongs_to: 'liz' }];
      expect(addRefs(topicRef, articles)).to.eql(articles);
    });
  });
});