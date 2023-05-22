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
exports.delete_comment = async(req,res,next)=>{
    try{
        const comment = await Comment.findOne({_id: req.params.commentid}).exec();
        if(!comment){
            res.status(404).send({message: "Comment not found"});
            return next(err);
        }else{
            await Comment.findByIdAndDelete({_id: comment._id}).exec();
            res.status(200).send({message: "Comment deleted"});
        }
    }catch(err){
        res.status(404).send({message:"some error occured"});
        return next(err);
    }
}

