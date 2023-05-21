const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.index = async (req, res, next) => {
  try {
    const posts = await Post.find({}).exec();
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
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        date: new Date(),
        // author: req.user,
        published: true,
      });
      await post.save();
    //   console.log(JSON.parse(req.user));
      res.redirect('/api');
    } catch (err) {
      res.status(403).send(err);
    }
  },
];
