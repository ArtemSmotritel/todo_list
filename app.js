const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./routes/index');

function logRequest({ method, url, body }, res, next) {
    console.log(`[${new Date().toISOString()}] ${method} ${url}`);
    console.log(body);
    next();
}

app.use(cors());
app.use(express.json());
app.use(logRequest);
app.use(router);

module.exports = app;