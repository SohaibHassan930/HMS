const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('Welcome'));

// Dashboard
router.get('/Profile', ensureAuthenticated, (req, res) =>
  res.render('Profile', {
    user: req.user,
    title:'Profile'
  })
);

module.exports = router;