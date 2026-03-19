require('dotenv').config()

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");

const app = express();

app.use(cors({
    origin: "http://localhost:3000"
}));

app.use(express.json());
app.use(helmet());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.post('/signup', async (req, res) => {

    const { name, email, password } = req.body;

    try {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const sql = "INSERT INTO users (`username`, `email`, `password`) VALUES (?, ?, ?)";

        db.query(sql, [name, email, hashedPassword], (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Database error" });
            }

            return res.json({ message: "User created" });
        });

    } catch (error) {

        return res.status(500).json({ error: "Signup failed" });

    }

});

app.post('/login', (req, res) => {

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [req.body.email], async (err, data) => {

        if (err) {
            return res.status(500).json({ error: "Database error" });
        }

        if (data.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = data[0];

        try {

            const passwordMatch = await bcrypt.compare(req.body.password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const accessToken = generateAccessToken(user);

            return res.json({
                accessToken,
                username: user.username
            });

        } catch (error) {

            return res.status(500).json({ error: "Login error" });

        }

    });

});

function generateAccessToken(user) {

    return jwt.sign(
        { user_id: user.user_id, username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
    );

}

function authenticateToken(req, res, next) {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {

        if (err) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();

    });

}

app.get('/posts/:thread_id', (req, res) => {

    const threadId = req.params.thread_id;

    const sql = `
    SELECT * FROM posts p
    JOIN thread t ON p.thread_id = t.thread_id
    JOIN users u ON p.user_id = u.user_id
    WHERE p.thread_id = ?
    `;

    db.query(sql, [threadId], (err, data) => {

        if (err) {
            return res.status(500).json({ error: "Database error" });
        }

        const post = data[0];

        let threadTitle = null;

        if (post) {
            threadTitle = post.thread_title;
        }

        return res.json({
            thread_title: threadTitle,
            posts: data
        });

    });

});

app.get('/postsCount/:thread_id', (req, res) => {

    const sql = "SELECT count(*) as count FROM posts WHERE thread_id = ?";

    db.query(sql, [req.params.thread_id], (err, data) => {

        if (err) {
            return res.status(500).json({ error: "Database error" });
        }

        return res.json(data);

    });

});


app.get('/threads', (req, res) => {

    const sql = "SELECT * FROM thread";

    db.query(sql, (err, data) => {

        if (err) {
            return res.status(500).json({ error: "Database error" });
        }

        return res.json(data);

    });

});

app.post('/thread', authenticateToken, (req, res) => {

    const sql = "INSERT INTO thread (thread_title) VALUES (?)";

    db.query(sql, [req.body.thread_title], (err, data) => {

        if (err) {
            return res.status(500).json({ error: "Database error" });
        }

        return res.json({ message: "Thread created" });

    });

});

app.post('/createPost/:thread_id', authenticateToken, (req, res) => {

    const threadId = req.params.thread_id;

    const sql = `
    INSERT INTO posts (thread_id, user_id, post_content, post_date)
    VALUES (?, ?, ?, NOW())
    `;

    db.query(sql, [

        threadId,
        req.user.user_id,
        req.body.post_content

    ], (err, data) => {

        if (err) {
            return res.status(500).json({ error: "Database error" });
        }

        return res.json({ message: "Post created" });

    });

});

app.get('/search', (req, res) => {

    const searchTerm = `%${req.query.term}%`;

    const sql = "SELECT * FROM thread WHERE thread_title LIKE ?";

    db.query(sql, [searchTerm], (err, data) => {

        if (err) {
            return res.status(500).json({ error: "Search error" });
        }

        return res.json(data);

    });

});

app.listen(8081, () => {

    console.log("Server running on port 8081");

});