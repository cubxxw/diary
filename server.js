const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression()); // Compress responses
app.use(cors()); // Enable CORS
app.use(express.static(path.join(__dirname, 'public')));

// Serve flomo directory as static files
app.use('/flomo', express.static(path.join(__dirname, 'flomo')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Flomo notes available at http://localhost:${PORT}/flomo/cubxxw.html`);
});