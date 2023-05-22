const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.index = async (req, res, next) => {
  try {
    const posts = await Post.find({}).populate('author', 'username').exec();
    res.json(posts);
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
        author: req.user.user,
        published: true,
      });
      await post.save();
      res.redirect('/api');
    } catch (err) {
      res.status(403).send(err);
    }
  },
];

exports.post_detail = async (req, res, next) => {
  try {
    const [thePost, allComments] = await Promise.all([
      Post.findById({ _id: req.params.postid })
        .populate('author', { username: 1, _id: 0 })
        .exec(),
      Comment.find({ post: req.params.postid }),
    ]);
    if (thePost) {
      res.send({ post: thePost, comments: allComments });
    } else {
      res.status(404).send({ message: 'Post not found' });
    }
  } catch (err) {
    next(err);
  }
};

exports.delete_post = async (req, res, next) => {
  try {
    const thePost = await Post.findById(
      { _id: req.params.postid },
      'title author'
    )
      .populate('author', { username: 1, _id: 0 })
      .exec();
    if (!thePost) {
      res.status(404).send({ message: 'Post not found' });
    } else {
      await Post.findOneAndDelete({ _id: thePost._id });
      res.status(200).send({ message: 'Deletion successful' });
    }
  } catch (err) {
    return next(err);
  }
};

exports.update_post = [
  body('title', 'Title cannot be empty').trim().notEmpty(),

  body('content', 'Content cannot be empty').trim().notEmpty(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send({ errors: errors.array() });
      return;
    }
    try {
      const post = {
        title: req.body.title,
        content: req.body.content,
        date: new Date(),
        author: req.user.user,
        published: true,
      };
      console.log(req.user.user);
      await Post.findOneAndUpdate({ _id: req.params.postid }, post);
      res.send({ message: 'Updation successful' });
    } catch (err) {
      res.status(403).send(err);
    }
  },
];
