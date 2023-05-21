const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.index = async (req, res, next) => {
  try {
    const posts = await Post.find({}).populate('author','username').exec();
    res.send(posts);
  } catch (err) {
    next(err);
  }
};

exports.get_posts = async (req, res, next) => {
  res.redirect('/api');
};

exports.create_post = [
  body('title', 'Title cannot be empty').trim().notEmpty(),

  body('content', 'Content cannot be empty').trim().notEmpty(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send({ errors: errors.array() });
      return;
    }
    try {
        const user = await User.findOne({user:req.user.username});
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        date: new Date(),
        author: user,
        published: true,
      });
      await post.save();
      console.log(user);
      res.redirect('/api');
    } catch (err) {
      res.status(403).send(err);
    }
  },
];
