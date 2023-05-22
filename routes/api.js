const express = require('express');
const router = express.Router();
const post_controller = require('../controllers/postController');
const auth_controller = require('../controllers/authController');
const comment_controller = require('../controllers/commentController');
const passport = require('passport');
router.get('/', post_controller.index);

router.post('/signup', auth_controller.signup);

router.post('/login', auth_controller.login);

router.get('/logout', auth_controller.logout);

router.get(
  '/posts/:postid',
  passport.authenticate('jwt', { session: false }),
  post_controller.post_detail
);

router.post(
  '/posts',
  passport.authenticate('jwt', { session: false }),
  post_controller.create_post
);

router.delete(
  '/posts/:postid',
  passport.authenticate('jwt', { session: false }),
  post_controller.delete_post
);

router.put(
  '/posts/:postid',
  passport.authenticate('jwt', { session: false }),
  post_controller.update_post
);

router.get(
  '/posts/:postid/comments',
  passport.authenticate('jwt', { session: false }),
  comment_controller.get_comments
);

router.post(
  '/posts/:postid/comment',
  passport.authenticate('jwt', { session: false }),
  comment_controller.create_comment
);

router.delete(
  '/posts/:postid/comment/:commentid',
  passport.authenticate('jwt',{session:false}),
  comment_controller.delete_comment,
)
module.exports = router;
