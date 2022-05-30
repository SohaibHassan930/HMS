const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('Student-Edit'));

// Dashboard
router.get('/Profile', ensureAuthenticated, (req, res) =>
  res.render('Profile', {
    user: req.user,
    title:'Profile'
  })
);

router.use(express.static('assets/css'))
router.use(express.static('assets/plugins/fontawesome/css'))
router.use(express.static('assets/plugins/morris'))
router.use(express.static('assets/img'))
router.use(express.static('assets/js'))
router.use(express.static('assets/plugins/slimscroll'))
router.use(express.static('vendor/select2'))
router.use(express.static('vendor/chartjs'))
router.use(express.static('vendor/perfect-scrollbar'))
router.use(express.static('vendor/circle-progress'))
router.use(express.static('vendor/counter-up'))
router.use(express.static('vendor/bootstrap-progressbar'))
router.use(express.static('vendor/animsition'))
router.use(express.static('vendor/wow'))
router.use(express.static('vendor/slick'))
router.use(express.static('vendor/bootstrap-4.1'))
router.use(express.static('vendor'))
router.use(express.static('vendor/css-hamburgers'))
router.use(express.static('vendor/mdi-font/css'))
router.use(express.static('vendor/counter-up'))

module.exports = router;