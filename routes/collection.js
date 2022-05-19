const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskControllers');

router.get('/today', async (req, res) => {
    const data = await controller.tasksForTheDay(new Date());
    res.json(data);
})

module.exports = router;