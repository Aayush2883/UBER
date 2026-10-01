const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');

connectToDb();

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        // Allow localhost, vercel app domains, render, or configured FRONTEND_URL
        if (
            origin.includes('localhost') ||
            origin.includes('127.0.0.1') ||
            origin.endsWith('.vercel.app') ||
            origin.includes('onrender.com') ||
            (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL)
        ) {
            return callback(null, true);
        }
        // Permissive fallback
        return callback(null, true);
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapsRoutes);
app.use('/rides', rideRoutes);

// Global error handler so the server never crashes on unhandled errors
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        message: err.message || 'An unexpected error occurred on the server'
    });
});

module.exports = app;


