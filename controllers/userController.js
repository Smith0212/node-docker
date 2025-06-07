const user = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.signUp = async (req, res) => {
    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        
        // Create a new user with the hashed password
        const newUser = await user.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        req.session.user = {
            id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email
        };
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await user.findOne({ username });

        if (!existingUser) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid username or password'
            });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid username or password'
            });
        }

        req.session.user = {
            id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email
        };

        res.status(200).json({
            status: 'success',
            data: {
                user: existingUser
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
