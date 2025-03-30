const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const AuthController = require('./controllers/authController');
const LiftController = require('./controllers/liftController');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Routes
// Auth routes
app.post('/api/register', AuthController.register);
app.post('/api/login', AuthController.login);

// Lift routes
app.post('/api/lifts', authenticateToken, LiftController.recordLift);
app.get('/api/lifts', authenticateToken, LiftController.getLifts);
app.post('/api/one-rep-max', authenticateToken, LiftController.calculateOneRepMax);
app.get('/api/one-rep-max/history', authenticateToken, LiftController.getOneRepMaxHistory);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 