const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const getIsbns = require('./getIsbns.js');

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    const targetIsbn = req.params.isbn;
    async function findBookByIsbn() {
       for (const book of Object.values(books)) {
        const isbns = await getIsbns(book.title, book.author);
            
        if (isbns.includes(targetIsbn)) {
            return `${book.title} by ${book.author}`;
        }
    }
    return "Not in repository";

    }
    const result = await findBookByIsbn();  
    res.json({ isbn: targetIsbn, result });
})
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let matches = [];
  let count = 0;
  const queriedAuthor = req.params.author;
  for (const book of Object.values(books)) {
    if (book.author.toLowerCase() === queriedAuthor.toLowerCase()) {
        matches.push(book);
        count++;
    }
  }

  if (count === 0){
    return res.json({ error: 'Our apologies, no hits for that author' });
  }
  res.json({ books: matches });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let matches = [];
  let count = 0;
  const queriedTitle = req.params.title;
  for (const book of Object.values(books)) {
    if (book.title.toLowerCase() === queriedTitle.toLowerCase()) {
        matches.push(book);
        count++;
    }
  }

  if (count === 0){
    return res.json({ error: 'Our apologies, no hits for that title' });
  }
  res.json({ books: matches });
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
    const targetIsbn = req.params.isbn;
    async function findBookByIsbn() {
       for (const book of Object.values(books)) {
        const isbns = await getIsbns(book.title, book.author);
            
        if (isbns.includes(targetIsbn)) {
            return {
                message: `Reviews for ${book.title} by ${book.author}`,
                reviews: book.reviews
            }
        }
    }
    return "Not in repository";

    }
    const result = await findBookByIsbn();  
    res.json({ isbn: targetIsbn, result });
});

module.exports.general = public_users;
