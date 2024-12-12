// @file ./routes/book.js

import { Router } from "express";
import axios from "axios";
import Book from "../models/Book.js";
import OpenLibraryService from "../services/OpenLibraryService.js";

const router = Router();

// Fetch books from OpenLibrary API and optionally save to the database
router.get("/", OpenLibraryService.login(), async (req, res) => {
  const { title, save } = req.query; // `save` determines if books should be saved to the DB

  if (!title) {
    return res.status(400).json({ error: "Please provide a book title." });
  }

  try {
    // Fetch book data from OpenLibrary API
    const response = await axios.get("https://openlibrary.org/search.json", {
      params: { title },
      headers: {
        Cookie: req.sessionCookie, // Send the session cookie
      },
      timeout: 5000, // Timeout after 5 seconds
    });

    // Extract book data from the response
    const booksData = response.data.docs.map((book) => ({
      title: book.title,
      author: book.author_name ? book.author_name[0] : "Unknown Author",
      isbn: book.isbn ? book.isbn[0] : "N/A",
      publisher: book.publisher ? book.publisher[0] : "Unknown Publisher",
      publish_date: book.publish_date ? book.publish_date[0] : "Unknown Date",
      key: book.key, // Get the unique key for fetching detailed info
    }));

    // Fetch detailed information (like description) for each book using the key
    const detailedBooksData = await Promise.all(
      booksData.map(async (book) => {
        try {
          // Use the book's key to fetch detailed data
          const detailedResponse = await axios.get(
            `https://openlibrary.org${book.key}.json`
          );

          // Get the book description if available
          const description = detailedResponse.data.description
            ? detailedResponse.data.description
            : "No description available.";

          // Return the detailed information along with the basic info
          return {
            ...book,
            description,
          };
        } catch (error) {
          console.error(
            `Error fetching details for book ${book.title}:`,
            error.message
          );
          return {
            ...book,
            description: "Error fetching description.",
          };
        }
      })
    );

    // Send the detailed book data as a response
    res.json({ books: detailedBooksData });
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// Retrieve all books from the database
router.get("/all", async (req, res) => {
  try {
    const books = await Book.find(); // Fetch all books
    res.json({ books });
  } catch (error) {
    console.error("Error retrieving books from database:", error.message);
    res.status(500).json({ error: "Failed to retrieve books from database." });
  }
});

// Delete a book by ISBN
router.delete("/:isbn", async (req, res) => {
  const { isbn } = req.params;

  try {
    const deletedBook = await Book.findOneAndDelete({ isbn });

    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found." });
    }

    res.json({ message: "Book deleted successfully.", book: deletedBook });
  } catch (error) {
    console.error("Error deleting book:", error.message);
    res.status(500).json({ error: "Failed to delete book." });
  }
});

export default router;
