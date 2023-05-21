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
      res.send(JSON.stringify(errors));
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
        // req.login(user, function (err) {
        //   if (err) {
        //     console.log(err);
        //   }
        //   return;
        // });
      } catch (err) {
        return next(err);
      }
    });
  },
];
