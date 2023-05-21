const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new UserSchema({
    username: {type: String, required:true,},
    passsword: {type:String, required:true},
    admin: {type: Boolean, default:false},
});

module.exports = mongoose.model('User',UserSchema);