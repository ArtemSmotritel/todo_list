const express = require('express')
const router = express.Router();
const controller = require('../controllers/taskControllers');
const RestfulRoutes = require('./RestfulRoutes');

RestfulRoutes(router, controller);

module.exports = router;