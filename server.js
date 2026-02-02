const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 80;
const DATA_FILE = 'data/data.json';

// Default credentials (use environment variables for production)
const AUTH_USERNAME = process.env.AUTH_USERNAME || 'admin';
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || 'admin';

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session.authenticated) {
    next();
  } else {
    res.redirect('/login.html');
  }
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
    req.session.authenticated = true;
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
});

// Protected data endpoints
app.get('/api/data', requireAuth, (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      res.json(JSON.parse(data));
    } else {
      // Default data
      const defaultData = {
        globalSettings: { printerPower: 100, electricityPrice: 0.12, currencySymbol: '🦁' },
        jobs: [],
        nextId: 1
      };
      res.json(defaultData);
    }
  } catch (err) {
    console.error('Error loading data:', err);
    res.status(500).send('Error loading data');
  }
});

app.post('/api/data', requireAuth, (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).send('Error saving data');
  }
});

// Serve login page without authentication
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Protect all other static files
app.use(requireAuth, express.static('.'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});