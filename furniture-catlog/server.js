const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/',              (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/sofas',         (req, res) => res.sendFile(path.join(__dirname, 'views', 'sofas.html')));
app.get('/corner-sofas',  (req, res) => res.sendFile(path.join(__dirname, 'views', 'corner-sofas.html')));
app.get('/sofa-beds',     (req, res) => res.sendFile(path.join(__dirname, 'views', 'sofa-beds.html')));
app.get('/beds',          (req, res) => res.sendFile(path.join(__dirname, 'views', 'beds.html')));
app.get('/mattresses',    (req, res) => res.sendFile(path.join(__dirname, 'views', 'mattresses.html')));
app.get('/wardrobes',     (req, res) => res.sendFile(path.join(__dirname, 'views', 'wardrobes.html')));
app.get('/contact',       (req, res) => res.sendFile(path.join(__dirname, 'views', 'contact.html')));

app.listen(PORT, () => {
  console.log(`Ashley Living running at http://localhost:${PORT}`);
});
