const mongoose = require('mongoose');

const createRef = (collection = [], refKey, refVal) => {
  return collection.reduce((ref, item) => {
    if(item[refKey] && item[refVal]) {
      ref[item[refKey]] = item[refVal];
    }
    return ref;
  }, {});
};

const addRefs = (ref, collection, replaceKey) => {
  return collection.map(item => {
    const refIdIsValid = mongoose.Types.ObjectId.isValid(ref[item[replaceKey]]);
    if(!refIdIsValid) return { ...item };
    return {
      ...item,
      [replaceKey]: ref[item[replaceKey]]
    };
  });
};


module.exports = {
  createRef,
  addRefs
};