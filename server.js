const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const multer = require('multer');
const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://kozak:<amik1111>@imageboard.pra0l.mongodb.net/?retryWrites=true&w=majority&appName=imageboard', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log("Connected to MongoDB");
  }).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
  
// Setup for file upload using Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Middleware to serve static files (images)
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.static('public')); // Ensure your static assets are in this folder

// Example in-memory posts storage (you could use a database instead)
let posts = [];

// POST route to upload a new post
app.post('/upload', upload.single('image'), (req, res) => {
    const newPost = {
        title: req.body.title,
        message: req.body.message,
        image: req.file ? req.file.filename : null,
        comments: []
    };
    posts.push(newPost); // Save the new post to the posts array

    res.json({ success: true });
});

// GET route to fetch all posts
app.get('/posts', (req, res) => {
    res.json(posts);
});

// POST route to add a comment to a post
app.post('/posts/:id/comments', (req, res) => {
    const postId = parseInt(req.params.id);
    const comment = req.body.comment;
    
    if (posts[postId]) {
        posts[postId].comments.push(comment);
        res.json({ success: true });
    } else {
        res.json({ success: false, error: 'Post not found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
