const mongoose = require('mongoose');
const { Schema } = mongoose;

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    required: true,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  belongs_to: {
    type: String,
    ref: 'topics',
    required: true
  },
  created_by: {
    type: String,
    ref: 'users',
    required: true
  }
}, { toJSON: { virtuals: true } });

ArticleSchema.virtual('topic', {
  ref: 'topics',
  localField: 'belongs_to',
  foreignField: 'slug',
  justOne: true
});

module.exports = mongoose.model('articles', ArticleSchema);
