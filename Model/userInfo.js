const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userData = new schema({
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
        type: number,
        required: true
    },
    gender: {
        type: String,
        required: true
    }
});