const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Import API routes
const dashboardRoutes = require('./routes/dashboard');

// Middleware setup
app.use(cors());
app.use(express.json());

// --- Authentication Routes ---
// Mock user database (for demonstration)
const users = [];

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  res.json({ token });
});

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Authentication token required.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    req.user = user;
    next();
  });
}

// Use the dashboard routes, applying the authentication middleware
app.use('/api', authenticateToken, dashboardRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Create a default user for easy testing
(async () => {
  const defaultUsername = 'testuser';
  const defaultPassword = 'password123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);
  users.push({ username: defaultUsername, password: hashedPassword });
  console.log(`Default user created: username='${defaultUsername}', password='${defaultPassword}'`);
})();
