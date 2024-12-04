// @file    ./routes/home.js

// Import necessary modules
import { Router } from "express";

// Initialize the router
const router = Router();

// Define the root route
router.get("/", async (req, res) => {
  try {
    // Respond with a welcome message
    res.status(200).send("Welcome to JJ");
  } catch (error) {
    // Handle unexpected errors
    console.error("Error handling the request:", error);
    res.status(500).send("An error occurred. Please try again later.");
  }
});

// Export the router
export default router;