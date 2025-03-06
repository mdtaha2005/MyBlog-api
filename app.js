// Required Dependencies
const express = require('express');
const cors = require('cors');  // Add this line to import CORS
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Secure password hashing
const jwt = require('jsonwebtoken'); // For authentication tokens

const SECRET_KEY = 'your_secret_key';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware

app.use(cors());  // This line allows all origins to make requests to your server

app.use(bodyParser.json());

// 1. MySQL Database Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: '', // Enter your sql password here
    database: 'blogapi'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

// 2. CRUD API Routes

// CREATE - Create a new blog post
app.post('/api/posts', (req, res) => {
    const { title, content, author, tags } = req.body;
    const query = 'INSERT INTO posts (title, content, author, tags) VALUES (?, ?, ?, ?)';

    connection.query(query, [title, content, author, JSON.stringify(tags)], (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        res.status(201).json({
            id: result.insertId,
            title,
            content,
            author,
            tags
        });
    });
});
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        connection.query(query, [username, hashedPassword], (err, result) => {
            if (err) {
                return res.status(400).json({ message: 'User already exists' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// **LOGIN API**
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        const user = results[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    });
});


// READ - Get all blog posts
app.get('/api/posts', (req, res) => {
    const query = 'SELECT * FROM posts';

    connection.query(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json(rows);
    });
});

// READ - Get a specific blog post by ID
app.get('/api/posts/:id', (req, res) => {
    const postId = req.params.id;
    const query = 'SELECT * FROM posts WHERE id = ?';

    connection.query(query, [postId], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(rows[0]);
    });
});

// UPDATE - Update a blog post
app.put('/api/posts/:id', (req, res) => {
    const postId = req.params.id;
    const { title, content, author, tags } = req.body;

    const query = 'UPDATE posts SET title = ?, content = ?, author = ?, tags = ?, updatedAt = NOW() WHERE id = ?';

    connection.query(query, [title, content, author, JSON.stringify(tags), postId], (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({
            id: postId,
            title,
            content,
            author,
            tags
        });
    });
});
// READ - Get blog posts filtered by tag
app.get('/api/posts/category/:tag', (req, res) => {
    const tag = req.params.tag;  // Extract the tag from the URL parameter
    const query = 'SELECT * FROM posts WHERE JSON_CONTAINS(tags, ?)';

    connection.query(query, [JSON.stringify([tag])], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json(rows);
    });
});


// DELETE - Delete a blog post
app.delete('/api/posts/:id', (req, res) => {
    const postId = req.params.id;
    const query = 'DELETE FROM posts WHERE id = ?';

    connection.query(query, [postId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    });
});

// 3. Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
