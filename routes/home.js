// @file    ./routes/home.js

// Import necessary modules
import { express } from "express";

// Initialize the router
const router = express.Router();

// Define the root route
router.get("/", async (req, res) => {
  try {
    // Respond with a welcome message
    return res.status(200).json({ message: "Welcome to JJ" });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error handling the request:", error);
    return res.status(500).json({
      error: error.message,
      message: "An error occurred. Please try again later.",
    });
  }
});

// Define the root route
router.get("/test", async (req, res) => {
  try {
    // Respond with a welcome message
    return res.status(200).json({ message: "hahahahah to JJ" });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error handling the request:", error);
    return res.status(500).json({
      error: error.message,
      message: "An error occurred. Please try again later.",
    });
  }
});

// Export the router object as a module.
module.exports = router
