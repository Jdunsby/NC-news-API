const { expect } = require('chai');
const { createRef } = require('../utils/seeding');

describe.only('utils', () => {
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
});