const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskControllers');

router.get('/', async (req, res) => {
    const data = await controller.countTasksToday(new Date());
    res.json(data);
})

module.exports = router;