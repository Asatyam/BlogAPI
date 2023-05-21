const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {type: String, required:true},
    author: {type: Schema.Types.ObjectId, ref:'User',required:true},
    content: {type:String, required:true},
    date: {type: Date, default:new Date().toLocaleDateString()},
    published:{type: Boolean},
})

module.exports = mongoose.model('Post', PostSchema);
