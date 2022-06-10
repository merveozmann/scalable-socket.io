const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    langue: {
        type: String,
        required: true,
        max: 50,
    },
    country: {
        type: String,
        required: true,
        max: 50,
    },
    
});

module.exports = mongoose.model("Users", userSchema)