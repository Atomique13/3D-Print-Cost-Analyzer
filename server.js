const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 80;
const DATA_FILE = 'data.json';

app.use(express.json());
app.use(express.static('.'));

app.get('/api/data', (req, res) => {
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

app.post('/api/data', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).send('Error saving data');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});