const express = require('express');  
let books = require("./booksdb.js");
const jwt = require('jsonwebtoken'); 
const session = require('express-session'); 
const getIsbns = require('./getIsbns.js');

const users = [];


const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => 
        user.username === username && user.password === password
    );
    return validusers.length > 0;
};

const isValid = (username) => {
    return /^[a-zA-Z0-9_]{4,12}$/.test(username);
};

const regd_users = express.Router();

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    
    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({ data: username }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = { accessToken, username };
        return res.status(200).json({ message: "User successfully logged in" });
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

/*regd_users.post("/register", (req, res) => {
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
});*/

// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
        const isbn = req.params.isbn;
        const review = req.body.review;
        const username = req.user.data;  
        
        if (!review || !isbn) {
            return res.status(400).json({ message: "ISBN and review required" });
        }
        let match = null;
        for (const book of Object.values(books)) {
            const isbns = await getIsbns(book.title, book.author);
            
            if (isbns.includes(isbn)) {
                
                match = book;
                        
                book.reviews[username] = review;
               
                return res.status(201).json({ 
                    message: `Review added for "${book.title}" by ${book.author}`,
                    disclaimer: 'ISBN data missing from course files; ISBN data cross referenced from Google Books API' 
                });
                
            }
        }
        
        // No book found
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    });

regd_users.delete("/auth/review/:isbn", async (req, res) => {
        const isbn = req.params.isbn;
        
        const username = req.user.data;  
        
        if (!isbn) {
            return res.status(400).json({ message: "ISBN and review required" });
        }
        let match = null;
        for (const book of Object.values(books)) {
            const isbns = await getIsbns(book.title, book.author);
            
            if (isbns.includes(isbn)) {
                
                match = book;
                        
                if(book.reviews[username]) {
                    delete book.reviews[username];
                
               
                    return res.status(201).json({ 
                    message: `Review deleted for "${book.title}" by ${book.author}`,
                    disclaimer: 'ISBN data missing from course files; ISBN data cross referenced from Google Books API' 
                });
                }
                else{
                    return res.status(201).json({ 
                        message: `Review not found by that user for "${book.title}" by ${book.author}`,
                        
                })
                }
            
                
            }
        }
        
        // No book found
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
