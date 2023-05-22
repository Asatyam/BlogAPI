const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  date: { type: Date, default: new Date().toLocaleDateString() },
  published: { type: Boolean, default: true },
  comments: [{
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: new Date().toLocaleDateString() },
  }],
});

module.exports = mongoose.model('Post', PostSchema);
