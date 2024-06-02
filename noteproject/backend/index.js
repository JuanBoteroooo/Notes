const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 5000;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id', [username, password]);
    req.session.userId = result.rows[0].id;
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT id FROM users WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length > 0) {
      req.session.userId = result.rows[0].id;
      res.status(200).send({ message: 'Login successful' });
    } else {
      res.status(401).send({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.get('/notes', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
  try {
    const result = await pool.query('SELECT * FROM notes WHERE user_id = $1', [req.session.userId]);
    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.post('/notes', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
  const { content } = req.body;
  try {
    const result = await pool.query('INSERT INTO notes (user_id, content) VALUES ($1, $2) RETURNING id, content', [req.session.userId, content]);
    res.status(201).send(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.delete('/notes/:id', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [id, req.session.userId]);
    res.status(200).send({ message: 'Note deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.put('/notes/:id', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
  const { id } = req.params;
  const { content } = req.body;
  try {
    const result = await pool.query('UPDATE notes SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING id, content', [content, id, req.session.userId]);
    res.status(200).send(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
