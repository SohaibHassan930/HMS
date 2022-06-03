const express = require('express');
const router = require('./index');
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../Model/user');
const userInfo = require('../Model/userinfo');
const Room = require('../Model/rooms');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/Login', forwardAuthenticated, (req, res) => res.render('Login'));

// Profile button press
router.get('/Profile', forwardAuthenticated, (req, res) => res.render('Profile'));

// Register Page
router.get('/Signin', forwardAuthenticated, (req, res) => res.render('Signin'));

// Admin Home View
router.get('/Admin-Dashboard', (req, res) => res.render('Admin-Dashboard'));

// Add Room View
router.get('/Add-Room', (req, res) => res.render('Add-Room'));

// Student View
router.get('/Student-View', async (req, res) => {

    try {
        const result = await userInfo.find();
        res.render('Student-View', { Data: result });
    } catch (err) {
        console.log(err);
    }
});


// room View
router.get('/Room-View', async (req, res) => {

    try {
        const result = await Room.find();
        res.render('Room-View', { Data: result });
    } catch (err) {
        console.log(err);
    }
});

// Student Edit
router.get('/Edit/:id', (req, res) => {
    let id = req.params.id;
    userInfo.findById(id, (err, result) => {
        if (err) {
            res.redirect('/');
        }
        else {
            res.render('Student-Edit', { data: result })
        }
    });
});
// Room Edit
router.get('/RoomEdit/:id', (req, res) => {
    let id = req.params.id;
    Room.findById(id, (err, result) => {
        if (err) {
            res.redirect('/');
        }
        else {
            res.render('Room-Edit', { data: result })
        }
    });
});

// Student Update
router.post('/update/:id', function (req, res) {
    userInfo.findByIdAndUpdate(req.params.id, {
        $set: {
            mobile: req.body.mob, address: req.body.address, home_phone: req.body.HP, postal_code: req.body.PC, city: req.body.city, cid: req.body.cid, room_type: req.body.room,
            room_number: req.body.room_num
        }
    },
        function (err, product) {
            if (err) return next(err);
            res.redirect('/users/Student-View');
        });
});

// Room Update
router.post('/RoomUpdate/:id', function (req, res) {
    Room.findByIdAndUpdate(req.params.id, {
        $set: {
            room_num: req.body.room_num, bed: req.body.bed, room_type: req.body.room_type
        }
    },
        function (err, product) {
            if (err) return next(err);
            res.redirect('/users/Room-View');
        });
});

// Student Delete
router.get('/Delete/:id', (req, res, next) => {
    userInfo.findByIdAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) {
            next(err);
        }
        else {
            res.redirect('/users/Student-View');
        }
    })
})

// res.redirect('/users/Student-View');
// Room View
router.get('/Room-View', (req, res) => res.render('Room-View'));


// Add Room
router.get('/Add-Room', (req, res) => res.render('Add-Room'));

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

//------------ Register Form Route ------------//
router.get('/Register', (req, res) => res.render('Register'));

//------------ Forgot Password Route ------------//
router.get('/forgot', (req, res) => res.render('forgot'));

//------------ Student Edit ------------//
router.get('/Student-Edit', (req, res) => res.render('Student-Edit'));


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


//------------ Room add Form Handle ------------//
router.post('/Add-Room', (req, res, next) => {
    var rooms = new Room({
        room_num: req.body.room_num,
        room_type: req.body.room,
        bed: req.body.bed
    })
    // console.log(rooms);
    rooms.save();
    res.redirect('/users/Admin-Dashboard');
});



module.exports = router;