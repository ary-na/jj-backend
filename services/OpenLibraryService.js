import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
class OpenLibraryService {
  constructor() {
    // Validate environment variables
    if (!process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_KEY) {
      throw new Error("Missing ACCESS or SECRET in env variables.");
    }

    this.access = process.env.S3_ACCESS_KEY;
    this.secret = process.env.S3_SECRET_KEY;
  }

  /**
   * Middleware for logging in to Open Library and setting session cookie.
   */
  login() {
    return async (req, res, next) => {
      try {
        const response = await axios.post(
          "https://openlibrary.org/account/login",
          { access: this.access, secret: this.secret },
          { headers: { "Content-Type": "application/json" }, timeout: 5000 }
        );

        const setCookieHeader = response.headers["set-cookie"];
        if (setCookieHeader && setCookieHeader.length > 0) {
          // Attach the session cookie to the request object
          req.sessionCookie = setCookieHeader[0].split(";")[0];
          next(); // Proceed to the next middleware/route handler
        } else {
          throw new Error("Session cookie not found in the response.");
        }
      } catch (error) {
        console.error("Error logging in to Open Library:", error.message);
        res.status(500).json({ error: "Failed to log in to Open Library." });
      }
    };
  }
}

export default new OpenLibraryService();
