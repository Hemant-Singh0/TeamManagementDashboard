require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require("./config/db");
const cors = require('cors');
const app = express();

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: "*" }));

// Routes
const authRoute = require("./routes/authRoutes");
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use("/api/auth", authRoute);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to API');
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
