const express = require('express');
const router = express.Router();

const lists = require('./lists');
const tasks = require('./tasks');

router.use('/lists/:listId/tasks', lists);
router.use('/tasks', tasks);

module.exports = router;