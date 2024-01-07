require('dotenv').config()

const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"furryfriendsdb"

})
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const sql = "INSERT INTO users (`username`, `email`, `password`) VALUES (?)";
    const salt = await bcrypt.genSalt() 
    const hashedPassword = await bcrypt.hash(password[0], salt);
    
    const values = [
        name,
        email,
        hashedPassword
    ]
    db.query(sql, [values], (err, data) => {
        
        if(err) {
            return res.json("Error");   
        }
        
        return res.json(data);
    })
})
app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE `email` = ?";

    db.query(sql, [req.body.email], async (err, data) => {
        
        if(err) {
            return res.json("Error");   
        }
        
        if(data.length > 0){
            const user = {
                user_id: data[0].user_id,
                username: data[0].username,
                email: data[0].email,
                password: data[0].password
            }
            const password = user.password
            const plainPassword = req.body.password[0]
            try {
                const passwordMatch = await comparePassword(plainPassword, password)
                if(passwordMatch) {
                    const accessToken = generateAccessToken(user)
                    
                    return res.json({ accessToken, username: user.username });
                }
            } catch {
                res.status(500).send()
            }
        }else {
            return res.json("Failed");
        }
    })
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
}

async function comparePassword(plainPassword, hashedPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
            if(err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    } )
}

app.get('/posts/:thread_id', (req, res) => {
    const threadId = req.params.thread_id;
    const sql = "SELECT * FROM `posts` p join thread t on p.thread_id = t.thread_id join users u on p.user_id = u.user_id WHERE p.thread_id = ?"
    db.query(sql, [threadId], (err, data) => {
        if(err) {
            return res.json("Error");
        }

        const post = data[0];
        let threadTitle = null;
        if(post != null) {
            threadTitle = post.thread_title;
        }   
        const customObject = {
            thread_title: threadTitle,
            posts: data
        }

        return res.json(customObject);
    })
})



app.get('/postsCount/:thread_id', (req, res) => {
    const threadId = req.params.thread_id;
    const sql = "SELECT count(*) FROM `posts` p where p.thread_id = ?"
    db.query(sql, [threadId], (err, data) => {
        if(err) {
            return res.json("Error");
        }

        return res.json(data);
    })
})

app.get('/threads', (req, res) => {
    const sql = "select * from thread t";
    db.query(sql, null, (err, data) => {
        if(err) {
            return res.json("Error")
        }

        return res.json(data);
    })
})

app.post('/thread', authenticateToken, (req, res) => {
    const sql = "insert into thread(thread_id, thread_title) values (?)";
    const values = [
        req.body.thread_id,
        req.body.thread_title
    ]
    console.log(values);
    db.query(sql, [values], (err, data) => {
        if(err) {
            return res.json("Error")
        }
        return res.json(data);
    })
})


app.post('/createPost/:thread_id', authenticateToken, (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    let user = null
    if(token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) =>{
            if(err) {
                console.log("Invalid or expired token:", err)
                return res.sendStatus(403);
            } else {
                user = decoded
            }
        })
    }
    const threadId = req.params.thread_id;
    const sql = "insert into posts(post_id, thread_id, user_id, post_content, post_date) values (?)"

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
  
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const currentTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const values = [
        0,
        threadId,
        user.user_id,
        req.body.post_content,
        currentTimestamp
    ]

    db.query(sql, [values], (err, data) => {
        if(err) {
            return res.json("Error")
        }
        return res.json(data);
    })

})
app.get('/search', (req, res) => {
    const searchTerm = `%${req.query.term}%`; 
    const sql = 'SELECT * FROM thread WHERE thread_title LIKE ?';
    
    db.query(sql, [searchTerm], (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Error searching threads' });
      }
  
      return res.json(data);
    });
  });

app.listen(8081, () => {
    console.log("listening");
})