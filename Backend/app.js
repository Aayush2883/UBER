const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const cors = require('cors');
const connectToDB = require('./db/db');
const cookieParser = require('cookie-parser');
connectToDB();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser());
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes')

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.use('/users', userRoutes); // Use user routes
app.use('/captain', captainRoutes);

module.exports = app;