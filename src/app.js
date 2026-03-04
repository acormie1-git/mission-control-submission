const express = require('express');
const neoRoutes = require('./routes/neoRoutes');
const apodRoutes = require('./routes/apodRoutes');
const donkiRoutes = require('./routes/donkiRoutes');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/neo', neoRoutes);
app.use('/apod', apodRoutes);
app.use('/donki', donkiRoutes);

// Generic error handler
app.use((err, req, res, next) => {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({
        error: {
            code: err.code || 'INTERNAL_SERVER_ERROR',
            message: err.message || 'Unexpected error'
        }
    });
});

module.exports = app;