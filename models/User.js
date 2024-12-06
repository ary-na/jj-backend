// @file: ./models/User.js

// Setup dependencies
import "mongoose-type-email";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";  // bcryptjs for password hashing

// User Schema definition
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,  // Ensure no leading/trailing spaces
    },
    lastName: {
      type: String,
      required: true,
      trim: true,  // Ensure no leading/trailing spaces
    },
    email: {
      type: mongoose.SchemaTypes.Email,
      required: true,
      unique: true,  // Ensure unique email addresses
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],  // Regular expression for email validation
    },
    password: {
      type: String,
      required: true,
      minlength: 8,  // Minimum length for passwords
    },
    avatar: {
      type: String,
      default: null,  // Optional field, default to null if not provided
    },
    bio: {
      type: String,
      default: null,  // Optional field, default to null if not provided
    },
    accessLevel: {
      type: Number,
      required: true,
      enum: [0, 1],  // Example: 0 = user, 1 = admin
      default: 0,  // Default to 'user' if no access level is provided
    },
    newUser: {
      type: Boolean,
      default: true,  // Default to true for new users
    }
  },
  { timestamps: true }
);

// Hash password before saving the user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();  // Only hash the password if it's new or modified

  try {
    const salt = await bcrypt.genSalt(10);  // Generate a salt
    this.password = await bcrypt.hash(this.password, salt);  // Hash the password
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare the password for authentication
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);  // Compare the hashed password
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Create the model from the schema
const userModel = mongoose.model('User', UserSchema, "users");

export default userModel;
