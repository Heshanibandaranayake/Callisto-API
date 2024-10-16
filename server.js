
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 443;

const sslOptions = {
  key: fs.readFileSync(path.resolve(__dirname, '../certs/board12.key')),
  cert: fs.readFileSync(path.resolve(__dirname, '../certs/board12.crt'))
};

const staticPath = '../UI/dist';

// Serve the static files
app.use(express.static(staticPath));

// Define your API routes
app.get('/api/data', (req, res) => {
  // Handle API requests here
  res.json({ message: 'API response' });
});

// Serve the Vue.js app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(staticPath, 'index.html'));
});

// Create HTTPS server
//const server = http.createServer(app);
const server = https.createServer(sslOptions, app);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

http.createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(80);
