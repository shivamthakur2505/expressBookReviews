const express = require('express');
const app = express();
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const booksArray = Object.values(books);
const bodyParser = require('body-parser');
app.use(express.json());

console.log(Array.isArray(booksArray)); // check if booksArray is an array

public_users.post("/register", async (req,res) => {
    const { username, password } = req.body;
    console.log(req.body);
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }
  
    // Check if username already exists
    const userExists = await users.find((user) => user.username === username);
    if (userExists) {
      return res.status(409).send('Username already exists');
    }
  
    // Add new user to the database
    const newUser = await users.create({ 
      "username": username, 
      "password": password 
    });
    users.push(newUser);
  
    // Return success message
    res.status(201).send('User registered successfully');
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = Array.isArray(books) ? books.find(b => b.isbn === isbn) : Object.values(books).find(b => b.isbn === isbn);

  if (!book) {
    // If book is not found, return a 404 status code and a message
    res.status(404).send('Book not found');
  } else {
    // If book is found, return the book details as a JSON object
    res.json(book);
  }
});


  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];

  for (let i = 0; i < books.length; i++) {
    if (books[i].author === author) {
      booksByAuthor.push(books[i]);
    }
  }

  if (booksByAuthor.length === 0) {
    // If no books by the author are found, return a 404 status code and a message
    console.log(`No books found by author "${author}"`);
    res.status(404).send(`No books found by author "${author}"`);
  } else {
    // If books by the author are found, return the book details as a JSON array
    console.log(`Books found by author "${author}":`, booksByAuthor);
    res.json(booksByAuthor);
  }
});




// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const book = Array.isArray(books) ? books.find(b => b.title === title) : Object.values(books).find(b => b.title === title);

  if (!book) {
    // If book is not found, return a 404 status code and a message
    res.status(404).send('Book not found');
  } else {
    // If book is found, return the book details as a JSON object
    res.json(book);
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const review = req.params.review;
  const book = Array.isArray(books) ? books.find(b => b.review === review) : Object.values(books).find(b => b.review === review);

  if (!book) {
    // If book is not found, return a 404 status code and a message
    res.status(404).send('Book not found');
  } else {
    // If book is found, return the book details as a JSON object
    res.json(book);
  }
});

module.exports.general = public_users;