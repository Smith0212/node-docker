const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        trim: true,
        maxlength: [50, "Name cannot be more than 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
});

const User = mongoose.model("User", userSchema);
module.exports = User;