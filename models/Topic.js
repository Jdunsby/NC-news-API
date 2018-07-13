const mongoose = require('mongoose');
const { Schema } = mongoose;

const TopicSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    lowercase: true,
    required: true,
    unique: true
  },
  fa_icon: {
    type: String,
    lowercase: true,
    required: true
  }
});

module.exports = mongoose.model('topics', TopicSchema);
