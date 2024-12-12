import { sign, verify } from "jsonwebtoken";
const bcrypt = require("bcrypt");

class AuthService {
  /**
   * Generates a JWT access token for a given user.
   * @param {Object} user - The user object to encode in the token.
   * @param {String} secret - Secret key for signing the token.
   * @param {String} expiresIn - Token expiration time.
   * @returns {String} Signed JWT access token.
   */
  static generateAccessToken(
    user,
    secret = process.env.ACCESS_TOKEN_SECRET,
    expiresIn = "1d"
  ) {
    if (!user || !secret) {
      throw new Error("User or secret key is missing.");
    }
    return sign({ user }, secret, { expiresIn });
  }

  /**
   * Middleware to authenticate a JWT token from the request.
   * @param {Object} req - HTTP request object.
   * @param {Object} res - HTTP response object.
   * @param {Function} next - Function to pass control to the next middleware.
   */
  static authenticateToken(req, res, next) {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      // If no token is found, return unauthorized.
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized! Token is missing." });
      }

      // Verify the token.
      verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          const errorMessage =
            err.name === "TokenExpiredError"
              ? "Unauthorized! Token has expired."
              : "Unauthorized! Invalid token.";
          return res.status(401).json({ message: errorMessage });
        }

        // Attach user info to the request object and proceed.
        req.user = decoded.user; // Assuming `user` is the key in your token payload.
        next();
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred during token authentication.",
        error: error.message,
      });
    }
  }
  /**
   * Hashes a plain-text password.
   * @param {String} password - The plain-text password to hash.
   * @returns {Promise<String>} - The hashed password.
   */
  static async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(10); // Generate salt
      return await bcrypt.hash(password, salt); // Hash the password
    } catch (error) {
      throw new Error("Error hashing password");
    }
  }

  /**
   * Compares a plain-text password with a hashed password.
   * @param {String} candidatePassword - The plain-text password to compare.
   * @param {String} hashedPassword - The hashed password to compare against.
   * @returns {Promise<Boolean>} - Whether the passwords match.
   */
  static async comparePassword(candidatePassword, hashedPassword) {
    try {
      return await bcrypt.compare(candidatePassword, hashedPassword);
    } catch (error) {
      throw new Error("Error comparing passwords");
    }
  }
}

export default new AuthService();
