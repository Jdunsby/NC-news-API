const { Comment } = require('../models');

const addCommentCount = (articles) => {
  const commentCounts = articles.map(article => {
    return Comment.find({ belongs_to: article._id }).count();
  });
  return Promise.all(commentCounts)
    .then(commentCounts => {

      return articles.map((article, i) => {
        return {
          ...article,
          comment_count: commentCounts[i]
        };
      });
    });
};

module.exports = {
  addCommentCount
};