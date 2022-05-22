const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../Model/user');
const userInfo = require('../Model/userinfo');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/Login', forwardAuthenticated, (req, res) => res.render('Login'));

// Profile button press
router.get('/Profile', forwardAuthenticated, (req, res) => res.render('Profile'));

// Signup Page
router.get('/Signin', forwardAuthenticated, (req, res) => res.render('Signin'));

//------------ Register Form Route ------------//
router.get('/Register', (req, res) => res.render('Register'));

// Register
router.post('/Signin', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('Signin', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('Signin', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                req.flash(
                                    'success_msg',
                                    'You are now registered and can log in'
                                );
                                res.redirect('/users/Register');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

// Login
router.post('/Login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/Profile',
        failureRedirect: '/users/Login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/Logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/Login');
});

//------------ Forgot Password Route ------------//
router.get('/forgot', (req, res) => res.render('forgot'));

//------------ Reset Password Route ------------//
router.get('/reset/:id', (req, res) => {
    // console.log(id)
    res.render('reset', { id: req.params.id })
});

//------------ Forgot Password Handle ------------//
router.post('/forgot', (req, res) => {
    User.findOne({ email: req.body.email }, function (err, data) {
        console.log(data);
        if (!data) {
            res.send({ "Success": "This Email Is not regestered!" });
        } else {
            // res.send({"Success":"Success!"});
            if (req.body.password == req.body.passwordConf) {
                data.password = req.body.password;
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(data.password, salt, (err, hash) => {
                        if (err) throw err;
                        data.password = hash;
                        data
                            .save()
                            .then(user => {
                                req.flash(
                                    'success_msg',
                                    'You are now registered and can log in'
                                );
                                res.redirect('/users/Login');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        }
    });
});

//------------ Register Form Handle ------------//
router.post('/Register', (req, res, next) => {
    var userinfo = new userInfo({
        fname: req.body.fname,
        lname: req.body.lname,
        dob: req.body.dob,
        cnic: req.body.cnic,
        mobile: req.body.mob,
        gender: req.body.gender,
        address: req.body.address,
        home_phone: req.body.HP,
        postal_code: req.body.PC,
        city: req.body.city,
        cid: req.body.cid,
        room_type: req.body.room,
        room_number: req.body.room_num,
        mess: req.body.mess
    })
    userinfo.save();
    res.redirect('/users/Login');
});

module.exports = router;