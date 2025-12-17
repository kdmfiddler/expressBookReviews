const getVolumes = require('./booksdb.js').getVolumes;
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const getIsbns = require('./getIsbns.js');

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => user.username === username);
    return userswithsamename.length > 0;
};

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const volumes = await getVolumes();
    res.json({
        message: "Volumes retrieved Asyncronously",
        volumes

    })
  }
  catch(error) {
    res.status(500).json({
        error: "Module unavailable, please contact support"
    })
  }
});

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    
    if (username && password && isValid(username)) {
        if (!doesExist(username)) {
            users.push({ username, password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    const targetIsbn = req.params.isbn;
    async function findBookByIsbn() {
       for (const book of Object.values(books)) {
        const isbns = await getIsbns(book.title, book.author);
            
        if (isbns.includes(targetIsbn)) {
            return {
                disclaimer: 'ISBN data missing from course files; ISBN data cross referenced from Google Books API',
                book: `${book.title} by ${book.author}`,
                reviews: book.reviews
            };
        }
    }
    return "Not in repository";

    }
    const result = await findBookByIsbn();  
    res.json({ isbn: targetIsbn, result });
})
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const volumes = await getVolumes();
        let matches = [];
        let count = 0;
        const queriedAuthor = req.params.author;
        for (const volume of Object.values(volumes)) {
            if (volume.author.toLowerCase() === queriedAuthor.toLowerCase()) {
                matches.push(volume);
                count++;
            }
        }
        res.json({
            message: "Volumes retrieved Asyncronously",
            matches
    
        })
      }
      catch(error) {
        res.status(500).json({
            error: "Module unavailable, please contact support"
        })
      }
    });
    /*let matches = [];
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
});*/

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const volumes = await getVolumes();
        let matches = [];
        let count = 0;
        const queriedTitle = req.params.title;
        for (const volume of Object.values(volumes)) {
            if (volume.title.toLowerCase() === queriedTitle.toLowerCase()) {
                matches.push(volume);
                count++;
            }
        }
        res.json({
            message: "Volumes retrieved Asyncronously",
            matches
    
        })
      }
      catch(error) {
        res.status(500).json({
            error: "Module unavailable, please contact support"
        })
      }
    });

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
    try{
        const volumes = await getVolumes();
        const targetIsbn = req.params.isbn;
        const result = await findBookByIsbn() {
            for (const book of Object.values(books)) {
            const isbns = await getIsbns(book.title, book.author);
            
            if (isbns.includes(targetIsbn)) {
                return {
                disclaimer: 'ISBN data missing from course files; ISBN data cross referenced from Google Books API',
                message: `Reviews for ${book.title} by ${book.author}`,
                reviews: book.reviews
            }
            else {
                return "Not in repository";            
            }
        }
    catch(error) {
        res.status(500).json({
            error: "Module unavailable"
        })
    }

    res.json({ isbn: targetIsbn, result });
});

module.exports.general = public_users;
