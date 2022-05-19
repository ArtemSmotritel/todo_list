const express = require('express');
const router = express.Router();

const lists = require('./lists');
const tasks = require('./tasks');
const dashboard = require('./dashboard');
const collection = require('./collection');

router.use('/lists/:listId/tasks', lists);
router.use('/tasks', tasks);
router.use('/dashboard', dashboard);
router.use('/collection', collection);

module.exports = router;