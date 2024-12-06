// @file    ./routes/user.js

// Setup dependencies for user routes.
import { Router } from "express";
const router = Router();
import User from "../models/User.js";

// GET -------------------------------------------------------------------------
// @route   /user
// @desc    Get all users.
// @access  Private
router.get("/", async (req, res) => {
  try {
    // Fetch all users from the User model
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      error: error.message,
      message: "An error occurred while fetching users.",
    });
  }
});

// POST ------------------------------------------------------------------------
// @route   /user
// @desc    Create a new user account.
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password, accessLevel } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !accessLevel) {
      return res.status(400).json({
        message:
          "First name, last name, email, password, and access level are required!",
      });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Create and save a new user
    const newUser = new User(req.body);
    const savedUser = await newUser.save();

    // Respond with the created user
    return res.status(201).json(savedUser);
  } catch (error) {
    // Handle errors
    console.error("Error creating user:", error);
    return res.status(500).json({
      error: error.message,
      message: "An error occurred while creating the user.",
    });
  }
});

// DELETE ----------------------------------------------------------------------
// @route   /user/:id
// @desc    Delete a user by id.
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the user exists before attempting to delete
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      message: "User deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      error: error.message,
      message: "An error occurred while deleting the user.",
    });
  }
});

// Export the router object as a module.
export default router;
