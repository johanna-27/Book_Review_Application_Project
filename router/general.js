const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
let { isValid, users } = require("./auth_users.js");
const public_users = express.Router();

function doesExist(username) {
    return users.some(user => user.username === username);
}

// Registration route
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    if (doesExist(username)) {
      return res.status(409).json({ message: "User already exists!" });
    }
  
    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered. Now you can login." });
});

// Helper function to simulate promise-based response
function getBooksPromise() {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject({ message: "No books available." });
        }
    });
}

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    getBooksPromise()
        .then(data => res.send(data))
        .catch(error => res.status(404).send(error));
});

// Get book details based on ISBN   
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        let book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject({ message: "Book not found with the provided ISBN." });
        }
    })
    .then(data => res.send(data))
    .catch(error => res.status(404).send(error));
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();
    new Promise((resolve, reject) => {
        let filtered_books = Object.values(books).filter(book => book.author.toLowerCase() === author);
        if (filtered_books.length > 0) {
            resolve(filtered_books);
        } else {
            reject({ message: "No books found by this author." });
        }
    })
    .then(data => res.send(data))
    .catch(error => res.status(404).send(error));
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    new Promise((resolve, reject) => {
        let filtered_books = Object.values(books).filter(book => book.title.toLowerCase() === title);
        if (filtered_books.length > 0) {
            resolve(filtered_books);
        } else {
            reject({ message: "No books found with this title." });
        }
    })
    .then(data => res.send(data))
    .catch(error => res.status(404).send(error));
});

// Get book review based on ISBN
public_users.get('/reviews/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        let book = books[isbn];
        if (book) {
            resolve(book.reviews);
        } else {
            reject({ message: "Book not found with the provided ISBN." });
        }
    })
    .then(data => res.send(data))
    .catch(error => res.status(404).send(error));
});

module.exports.general = public_users;
