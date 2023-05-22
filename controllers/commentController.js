const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');


exports.get_comments = async(req,res,next)=>{

    const comments = await Comment.find({post: req.params.postid}).exec();
    if(comments.length>0){
        res.send(comments);
    }else{
        res.status(404).send({messsage: "No comments yet"});
    }
}
exports.create_comment = [
    body('content','comment cannot be empty').trim().notEmpty(),

    async(req,res,next)=>{
        try{
            const comment = new Comment({
                content: req.body.content,
                author: req.user.user,
                post: req.params.postid,
                date: (new Date())
            });
            await comment.save();
            res.status(200).send({message: "comment added"});
        }catch(err){
            res.send({message: "Some error occured"});
            return next(err);
        }
    }
]

