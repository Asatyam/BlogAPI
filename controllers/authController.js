const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

exports.signup = [
  body('username')
    .trim()
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        return await Promise.reject('Username already taken');
      }
      return true;
    })
    .escape(),

  body('password')
    .trim()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must be of 8 characters with 1 lowercase, 1 uppercase, 1 number and 1 special symbols'
    )
    .escape(),
  body('confirm')
    .trim()
    .custom(async (value, { req }) => {
      const password = req.body.password;
      if (password !== value) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({errors: errors.array()});
      return;
    }
    bcryptjs.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        res.send(err);
      }
      try {
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
          admin: false,
        });
        await user.save();
        res.status(200).json({message:"User created",user:req.user});
      } catch (err) {
        return next(err);
      }
    });
  },
];

exports.login =  async (req, res, next) => {
  try{passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      const error = new Error('User does not exist');
      return res.status(403).json({
        info,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        next(err);
      }
      const body = {
        _id: user._id,
        username: user.username,
        admin: user.admin,
      };
      const token = jwt.sign({user:body}, process.env.SECRET);
      return res.status(200).json({ body, token });
    });
  })(req, res, next);
}catch(err){
  res.status(403).json({err});
}
};

exports.logout = async(req,res,next)=>{
  req.logout(function(err){
    if(err){
      return next(err);
    }
    res.redirect('/api');
  });
};