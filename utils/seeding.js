const createRef = (collection = [], refKey, refVal) => {
  return collection.reduce((ref, item) => {
    if(item[refKey] && item[refVal]) {
      ref[item[refKey]] = item[refVal];
    }
    return ref;
  }, {});
};

module.exports = {
  createRef
};