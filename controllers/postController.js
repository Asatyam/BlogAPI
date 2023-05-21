const express = require('express');
const mongoose  = require('mongoose');
const {body, validationResult} = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');


exports.index = async(req,res,next)=>{

    try{
        const posts = await Post.find({}).exec();
        res.send(posts);
    }catch(err){
        next(err);
    }
}

exports.get_posts = async(req,res,next)=>{
    res.redirect('/api');
}