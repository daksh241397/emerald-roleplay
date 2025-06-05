import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'mysql2/promise';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'emerald_rp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Whitelist application endpoint
app.post('/api/whitelist/apply', async (req, res) => {
  try {
    const { name, discordId, steamId, age, rpExperience, motivation } = req.body;

    // Validate required fields
    if (!name || !discordId || !steamId || !age || !rpExperience || !motivation) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Store application in database
    const [result] = await pool.execute(
      'INSERT INTO whitelist_applications (name, discord_id, steam_id, age, rp_experience, motivation) VALUES (?, ?, ?, ?, ?, ?)',
      [name, discordId, steamId, age, rpExperience, motivation]
    );

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error submitting whitelist application:', error);
    res.status(500).json({ message: 'Failed to submit application' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 