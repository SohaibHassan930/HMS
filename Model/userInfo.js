const mongoose = require('mongoose');

const schema = mongoose.Schema;

const info = new schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    cnic: {
        type: String,
        unique: true,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    home_phone: {
        type: String,
        required: true
    },
    postal_code: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    cid: {
        type: String,
        required: true
    },
    room_type: {
        type: String,
        required: true
    },
    room_number: {
        type: String,
        required: true
    },
    mess: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('userinfo', info);