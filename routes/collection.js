const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskControllers');

router.get('/today', async (req, res) => {
    try {
        const data = await controller.tasksForTheDay(new Date());
        res.json(data);
    } catch (error) {
        res.status(500).json('something went very wrong');
    }
})

module.exports = router;