const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const MONGO_URI = process.env.MONGO_URI ;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME

app.use(cors());
app.use(express.json());

/*  VERY IMPORTANT — serve your HTML/CSS/JS files */
app.use(express.static(__dirname));

/*  Open homepage when visiting localhost:5000 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route modules
const authRoutes = require('./routes/auth');
const historyRoutes = require('./routes/history');
const analyzeRoutes = require('./routes/analyze');

app.use('/', authRoutes);
app.use('/', historyRoutes);
app.use('/', analyzeRoutes);

const db = require('./db');

async function startServer() {
  try {
    console.log('Connecting to MongoDB...');
    await db.connectDB(MONGO_URI, MONGO_DB_NAME);
    console.log('MongoDB connected');
    await db.ensureDefaultAdmin();

    app.listen(5000);
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();
