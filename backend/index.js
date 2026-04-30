require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise'); 

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION POOL ---
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Check if the database connects successfully when the server starts
pool.getConnection()
  .then(() => console.log('✅ Connected to MySQL Database!'))
  .catch((err) => console.error('❌ MySQL Connection Error:', err.message));


// --- ROUTES ---

// 1. REGISTRATION ENDPOINT
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username already taken!' });
    }

    // Insert the new user into the database
    await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// 2. LOGIN ENDPOINT
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Search for the user in the database
    const [users] = await pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

    // If array is empty, user doesn't exist or wrong password
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Grab the first user from the results
    const user = users[0];

    // Generate JWT Token using the database ID and username
    const token = jwt.sign(
      { id: user.id, username: user.username }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful!', token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Start Server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Backend running on port ${port}`);
});