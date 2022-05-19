const TaskModel = require('../models/task');

class TaskController {
    find(listId, done) {
        return TaskModel.find(listId, done);
    }
    findById(id) {
        return TaskModel.findById(id);
    }
    create(listId, task) {
        return TaskModel.create(listId, task);
    }
    partialUpdateById(id, update) {
        return TaskModel.partialUpdateById(id, update);
    }
    replaceById(id, update) {
        return TaskModel.replaceById(id, update);
    }
    deleteById(id) {
        return TaskModel.deleteById(id);
    }
}

module.exports = new TaskController();