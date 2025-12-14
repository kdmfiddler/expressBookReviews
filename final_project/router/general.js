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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
