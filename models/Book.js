// @file: ./models/Book.js

// Setup dependencies
import mongoose from "mongoose";

// Book Schema definition
const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // Ensure no leading/trailing spaces
    },
    author: {
      type: [String], // Support multiple authors
      required: true,
      trim: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true, // Ensure unique ISBNs
      match: [/^\d{10}(\d{3})?$/, "Please provide a valid ISBN (10 or 13 digits)"], // ISBN-10 or ISBN-13
    },
    publisher: {
      type: String,
      trim: true,
      default: null, // Optional field
    },
    publicationDate: {
      type: Date, // Use Date type for proper date handling
      default: null,
    },
    genre: {
      type: [String], // Support multiple genres
      default: [],
    },
    pages: {
      type: Number,
      required: true,
      min: 1, // Ensure books have at least 1 page
    },
    language: {
      type: String,
      default: "English", // Default language is English
    },
    summaries: {
      type: Map, // Multilingual summaries
      of: String, // Each summary is a string
    },
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt` fields
);

// Create the model from the schema
const Book = mongoose.model("Book", BookSchema, "books");

export default Book;