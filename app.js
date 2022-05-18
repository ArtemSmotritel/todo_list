const express = require('express');
const app = express();
const router = require('./routes/index');
const { connectToDb, disconnectFromDb } = require('./database/client');

function logRequest({ method, url }, res, next) {
    console.log(`[${new Date().toISOString()}] ${method} ${url}`);
    next();
}

connectToDb();
console.log('Connected to the database');

app.use(express.json());
app.use(logRequest);
app.use(router);

module.exports = app;