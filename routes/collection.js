const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskControllers');

collection(router, controller);

function collection(router, controller) {
    router.get('/today', async (req, res) => {
        const data = await controller.tasksForTheDay(new Date());
        res.json(data);
    })
}

module.exports = router;