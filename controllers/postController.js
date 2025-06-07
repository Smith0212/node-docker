const post  = require("../models/postModel");

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await post.find({});
        res.status(200).json({
            status: "success",
            results: posts.length,
            data: {
                posts
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
}

exports.createPost = async (req, res) => {
    try {
        const newPost = await post.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                post: newPost
            }
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
}

exports.getOnePost = async (req, res) => {
    try {
        const post = await post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                status: "fail",
                message: "Post not found"
            });
        }
        res.status(200).json({
            status: "success",
            data: {
                post
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
}

exports.updatePost = async (req, res) => {
    try {
        const updatedPost = await post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedPost) {
            return res.status(404).json({
                status: "fail",
                message: "Post not found"
            });
        }
        res.status(200).json({
            status: "success",
            data: {
                post: updatedPost
            }
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
}

exports.deletePost = async (req, res) => {
    try {
        const postToDelete = await post.findByIdAndDelete(req.params.id);
        if (!postToDelete) {
            return res.status(404).json({
                status: "fail",
                message: "Post not found"
            });
        }
        res.status(200).json({
            status: "success",
            message: "This post is deleted",
            data: {
                post: postToDelete
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
}