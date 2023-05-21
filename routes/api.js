const express = require('express');
const router = express.Router();
const post_controller = require('../controllers/postController');
const auth_controller = require('../controllers/authController');
router.get('/',post_controller.index);

router.post('/signup',auth_controller.signup );

module.exports = router;