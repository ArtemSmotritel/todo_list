const { knex } = require('../database/knex');

class TaskModel {
    async find(listId, done) {
        const list = await knex('tasks').where('list_id', listId).whereIn('done', [false, done]);
        return list;
    }
    async findById(id) {
        const task = await knex('tasks').where('id', id);
        return task[0];
    }
    async create(listId, newTask) {
        const task = {
            description: newTask.description,
            list_id: listId,
            done: newTask.done || false,
            due_date: newTask.dueDate || new Date(),
        }

        await knex('tasks').insert(task)[0];
    }
    async partialUpdateById(id, update) {
        let newDone;
        const { description, list_id, due_date, done } = await this.findById(id);
        if (update.done === false || update.done === true) {
            newDone = update.done; // done = new done prop if any 
        } else {
            newDone = done; // done = already existing value in db
        }

        await knex('tasks').where('id', id).update({
            description: update.description || description,
            done: newDone,
            list_id: update.listId || list_id,
            due_date: update.dueDate || due_date,
        })

        return this.findById(id);
    }
    async replaceById(id, update) {
        await knex('tasks').where('id', id).update({
            description: update.description || 'default task',
            done: update.done || false,
            list_id: update.listId || 1,
            due_date: update.dueDate || new Date(),
        })

        return this.findById(id);
    }
    async deleteById(id) {
        knex('tasks').where('id', id).del();
    }
    async countTasksToday() {
        const today = new Date();
        const taskCount = await knex('tasks').count('id').whereBetween('due_date', [today, today]);
        const taskCountByList = await knex('tasks')
            .count('tasks.id as tasks_count').select('lists.name as list_name')
            .rightJoin('lists', 'tasks.list_id', 'lists.id')
            .where('tasks.done', false)
            .groupBy('lists.name');

        return {
            tasks_for_today: taskCount[0].count,
            undone_tasks_by_list: taskCountByList,
        };
    }
    async tasksForTheDay(day) {
        const tasks = await knex('tasks')
            .select('tasks.description', 'tasks.done', 'tasks.id', 'lists.name as list_name')
            .rightJoin('lists', 'tasks.list_id', 'lists.id')
            .whereBetween('tasks.due_date', [day, day]);

        return tasks;
    }
}

module.exports = new TaskModel();