const mongoose = require('mongoose');
const user_type = require('./user_types');

const users = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },

    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    image : {
        type : String,
    },
    
    user_type : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user_types"
    },

    is_password_reset : {
        type : Boolean,
        default : false
    },
    password_token : String


});

module.exports = mongoose.model("users", users);