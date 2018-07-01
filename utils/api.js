const { Comment } = require('../models');

const addCommentCount = (articles) => {
  const articleIsObject = articles.constructor === Object;
  if(articleIsObject) articles = [articles];
  const commentCounts = articles.map(article => {
    return Comment.find({belongs_to: article._id}).count();
  });
  return Promise.all(commentCounts)
    .then(commentCounts => {
      if(articleIsObject) return {...articles[0], comment_count: commentCounts[0]};
      else{
        return articles.map((article, i) => {
          return {
            ...article,
            comment_count: commentCounts[i]
          };
        });
      }
    });
};

module.exports = {
  addCommentCount
};