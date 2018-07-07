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

const withErrorHandling = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res);
    }
    catch (err) {
      next(err);
    }
  };
};

module.exports = {
  addCommentCount,
  withErrorHandling
};