const API_URL = process.env.API_URL || require('../config').API_URL;
const apiRootData = {
  'Home': `${API_URL}`,
  'API_root': `${API_URL}/api`,
  'GET_topics': `${API_URL}/api/topics`,
  'GET_topic_by_id': `${API_URL}/api/topics/{topic_slug}`,
  'GET_articles_by_topic_slug': `${API_URL}/api/topics/{topic_slug}/articles`,
  'POST_article_to_topic': `${API_URL}/api/topics/{topic_slug}/articles body:{title, body, created_by:{user_id}}`,
  'GET_articles': `${API_URL}/api/articles`,
  'GET_article_by_id': `${API_URL}/api/articles/{article_id}`,
  'PUT_vote_on_article': `${API_URL}/api/articles/{article_id}?vote={up/down}`,
  'DELETE_article': `${API_URL}/api/articles/{article_id}`,
  'GET_comments_for_article': `${API_URL}/api/articles/{article_id}/comments`,
  'POST_comment_to_article': `${API_URL}/api/articles/{article_id}/comments body:{body, created_by:{user_id}}`,
  'PUT_vote_on_comment': `${API_URL}/api/comments/{comment_id}?vote={up/down}`,
  'DELETE_comment': `${API_URL}/api/comments/{comment_id}`,
  'GET_users': `${API_URL}/api/users`,
  'GET_user_by_id': `${API_URL}/api/users/{user_id}`
};

module.exports = apiRootData;