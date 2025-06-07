const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a title"],
        trim: true,
        maxlength: [100, "Title cannot be more than 100 characters"]
    },
    content: {
        type: String,
        required: [true, "Please provide content"],
        trim: true
    },
});

const Post = mongoose.model("Post", postSchema)
module.exports = Post;