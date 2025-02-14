const express = require('express');
const { resolve } = require('path');
const connectedDatabase = require('./database'); // Ensure this path is correct
const MenuItem = require('./model/MenuItem');

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json()); // Middleware to parse JSON request bodies

// Connect to the database
connectedDatabase();

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// POST /menu: Create a new menu item
app.post('/menu', async (req, res) => {
  const { name, price, description } = req.body;

  // Basic validation
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required.' });
  }

  try {
    const newItem = new MenuItem({ name, price, description });
    const savedItem = await newItem.save();
    res.status(201).json({ message: 'Menu item created successfully.', item: savedItem });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the menu item.' });
  }
});

// GET /menu: Fetch all menu items
app.get('/menu', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching menu items.' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});