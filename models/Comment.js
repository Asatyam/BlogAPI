const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  author: {type: String, required: true},
  post: {type: Schema.Types.ObjectId, ref: "Post", required:true},
  date: { type: Date, default: new Date().toLocaleString() },

});

module.exports = mongoose.model('Comment', CommentSchema);
