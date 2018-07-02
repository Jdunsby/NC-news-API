const API_URL = process.env.API_URL || require('../config').API_URL;
const apiRootData = {
  'home': `${API_URL}`,
  'api_root': `${API_URL}/api`,
  'GET_topics': `${API_URL}/topics`,
  'GET_topic_by_id': `${API_URL}/topics/{topic_id}`,
  'GET_articles_by_topic_id': `${API_URL}/topics/{topic_id}/articles`,
  'POST_article_to_topic': `${API_URL}/topics/{topic_id}/articles body:{title, body, created_by:{user_id}}`,
  'GET_articles': `${API_URL}/articles`,
  'GET_article_by_id': `${API_URL}/articles/{article_id}`,
  'PUT_vote_on_article': `${API_URL}/articles/{article_id}?vote={up/down}`,
  'DELETE_article': `${API_URL}/articles/{article_id}`,
  'GET_comments_for_article': `${API_URL}/articles/{article_id}/comments`,
  'POST_comment_to_article': `${API_URL}/articles/{article_id}/comments body:{body, created_by:{user_id}}`,
  'PUT_vote_on_comment': `${API_URL}/comments/{comment_id}?vote={up/down}`,
  'DELETE_comment': `${API_URL}/comments/{comment_id}`,
  'GET_users': `${API_URL}/users`,
  'GET_user_by_id': `${API_URL}/users/{user_id}`
};

module.exports = apiRootData;