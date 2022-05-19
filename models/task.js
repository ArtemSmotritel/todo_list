const { makeRequest } = require('../database/client');
//const knex = require('../database/knex');

class TaskModel {
    async find(listId, done) {
        const query =
            "select * from tasks " +
            "where list_id=$1 and (done=false or done=$2)";
        const requestValues = [listId, done];
        const list = await makeRequest(query, requestValues);

        return list.rows;

        const t = await knex('tasks').where('list_id', listId).whereIn('done', [false, done]);
        return t.rows;
    }
    async findById(id) {
        const query = "select * from tasks where id=$1";
        const requestValues = [id];
        const task = await makeRequest(query, requestValues);

        return task.rows[0];

        const t = await knex('tasks').where('id', id);
        return t.rows[0];
    }
    async create(listId, newTask) {
        const query = "insert into tasks (description, done, list_id, due_date) values ($1, $2, $3, $4)";
        const requestValues = [newTask.description, newTask.done || false, listId, newTask.dueDate || new Date()];
        await makeRequest(query, requestValues);

        return (await this.find(listId)).slice(-1)[0]; // returning the last added task to the list 

        const t = {
            description: newTask.description,
            list_id: listId,
            done: newTask.done || false,
            due_date: newTask.dueDate || new Date(),
        }
        await knex('tasks').insert(t);
    }
    async partialUpdateById(id, update) {
        let newDone;
        const { description, list_id, due_date, done } = await this.findById(id);
        const query = "update tasks set description = $1, done = $2, list_id = $3, due_date = $4 where id=$5";
        if (update.done === false || update.done === true) {
            newDone = update.done; // done = new done prop if any 
        } else {
            newDone = done; // done = already existing value in db
        }
        const requestValues = [update.description || description, newDone, update.listId || list_id, update.dueDate || due_date, id];
        await makeRequest(query, requestValues);

        return this.findById(id);

        const t = await knex('tasks').where('id', id).update({
            description: update.description || description,
            done: newDone,
            list_id: update.listId || list_id,
            due_date: update.dueDate || due_date,
        })
        return t;
    }
    async replaceById(id, update) {
        const query = "update tasks set description = $1, done = $2, list_id = $3, due_date = $4 where id=$5";
        const requestValues = [update.description || 'default task', update.done || false, update.listId || 1, update.dueDate || new Date(), id];
        await makeRequest(query, requestValues);

        return this.findById(id);

        const t = await knex('tasks').where('id', id).update({
            description: update.description || 'default task',
            done: update.done || false,
            list_id: update.listId || 1,
            due_date: update.dueDate || new Date(),
        })
        return t;
    }
    async deleteById(id) {
        const query = "delete from tasks where id=$1";
        const requestValues = [id];
        await makeRequest(query, requestValues);

        // knex('tasks').where('id', id).del();
    }
    async countTasksToday() {
        const today = new Date();
        const query =
            "select count(*) from tasks " +
            "where due_date between $1 and $2";
        const requestValues = [today, today];
        const taskCount = await makeRequest(query, requestValues);

        const query2 =
            "select count(tasks.id) as tasks_count, lists.name as list_name " +
            "from tasks right join lists on tasks.list_id = lists.id " +
            "where tasks.done = false group by lists.name";
        const taskCountByList = await makeRequest(query2);

        return {
            tasks_for_today: taskCount.rows[0].count,
            undone_tasks_by_list: taskCountByList.rows,
        };

        taskCount = await knex('tasks').count('id').whereBetween('due_date', [today, today]);
        taskCountByList = await knex('tasks')
            .count('tasks.id as tasks_count').select('lists.name as list_name')
            .rightJoin('lists', 'tasks.list_id', 'lists.id')
            .where('tasks.done', false)
            .groupBy('lists.name');
    }
    async tasksForTheDay(day) {
        const query =
            "select tasks.description, tasks.done, tasks.id, lists.name as list_name " +
            "from tasks right join lists on tasks.list_id = lists.id " +
            "where tasks.due_date between $1 and $2";
        const requestValues = [day, day];
        const result = await makeRequest(query, requestValues);
        return result.rows;

        const t = await knex('tasks')
            .select('tasks.description', 'tasks.done', 'tasks.id', 'lists.name as list_name')
            .rightJoin('lists', 'tasks.list_id', 'lists.id')
            .whereBetween('tasks.due_date', [day, day]);
        return t.rows;
    }
}

module.exports = new TaskModel();