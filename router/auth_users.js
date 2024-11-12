const express = require('express');
let books = require("./booksdb.js");  // Assuming booksdb.js contains a list of books
const regd_users = express.Router();

// Sample users for demonstration
let users = [
  { username: "user1", password: "password123" },
  { username: "john_doe", password: "john123" },
  { username: "alice_smith", password: "alice123" }
];

// Login route to authenticate user and store username in session
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if username and password match
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    // Store username in session
    req.session.username = username;
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(401).json({ message: "Invalid username or password." });
  }
});

// Add or update a book review (authenticated user)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.session.username;  // Get username from session

  // Validate review input
  if (!review) {
    return res.status(400).json({ message: "Review content is required." });
  }

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Initialize reviews object if not already initialized
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or update the review for the book under the username
  books[isbn].reviews[username] = review;

  return res.status(200).json({ 
    message: "Review added successfully.",
    reviews: books[isbn].reviews
  });
});


//only a authenticated user can delete the reviews
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.username;  // Get username from session

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Check if the book has reviews
  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "No reviews." });
  }

  // Delete the review for the logged-in user
  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully."
  });
});

module.exports.authenticated = regd_users;
