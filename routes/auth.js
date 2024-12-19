// @file    ./routes/auth.js

// Import necessary modules
import { Router } from "express";
import User from "../models/User.js";
import AuthService from "../services/AuthService.js";


// Initialize the router
const router = Router();

// POST ------------------------------------------------------------------------
// @route   /login
// @desc    Login.
// @access  Public
router.post('/login', async (req, res) => {
    // Check if an email or a password is not provided.
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: "Email or password is missing!"
        });
    }

    try {
        // Find user in the database using the email filter.
        const user = await User.findOne({ email: req.body.email });

        // Check if user does not exist.
        if (!user) {
            return res.status(400).json({
                message: "User not found!"
            });
        }

        // Use AuthService to compare the password.
        const isPasswordValid = await AuthService.comparePassword(req.body.password, user.password);

        if (isPasswordValid) {
            // Create a user object to be used in the JWT payload.
            const userObject = { _id: user._id };

            // Use AuthService to generate JWT access token.
            const accessToken = AuthService.generateAccessToken(userObject);

            // Set password field to undefined before returning user data.
            user.password = undefined;

            // Send response with access token and user data.
            return res.json({
                accessToken: accessToken,
                user: user
            });
        } else {
            return res.status(400).json({
                message: "Incorrect password or email!"
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Error signing in!",
            error: err
        });
    }
});

// GET -------------------------------------------------------------------------
// @route   /validate
// @desc    Validate Login.
// @access  Public
router.get('/validate', AuthService.authenticateToken, async (req, res) => {
    // After the token is verified, the user info is available on req.user
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Set password field to undefined before returning user data.
        user.password = undefined;

        return res.json({
            user: user
        });
    } catch (err) {
        console.error(err);
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
});

export default router;