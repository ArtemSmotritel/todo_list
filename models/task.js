const { makeRequest } = require('../database/client');

class TaskModel {
    async find(listId, done) {
        const query =
            "select * from tasks " +
            "where list_id=$1 and (done=false or done=$2)";
        const requestValues = [listId, done];
        const list = await makeRequest(query, requestValues);

        return list.rows;
    }
    async findById(id) {
        const query = "select * from tasks where id=$1";
        const requestValues = [id];
        const task = await makeRequest(query, requestValues);

        return task.rows[0];
    }
    async create(listId, newTask) {
        const query = "insert into tasks (description, done, list_id, due_date) values ($1, $2, $3, $4)";
        const requestValues = [newTask.description, newTask.done || false, listId, newTask.dueDate || new Date()];

        return await makeRequest(query, requestValues);
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
    }
    async replaceById(id, update) {
        const query = "update tasks set description = $1, done = $2, list_id = $3, due_date = $4 where id=$5";
        const requestValues = [update.description || 'default task', update.done || false, update.listId || 1, update.dueDate || new Date(), id];
        await makeRequest(query, requestValues);

        return this.findById(id);
    }
    async deleteById(id) {
        const query = "delete from tasks where id=$1";
        const requestValues = [id];
        await makeRequest(query, requestValues);
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
    }
    async tasksForTheDay(day) {
        const query =
            "select tasks.description, tasks.done, tasks.id, lists.name as list_name " +
            "from tasks right join lists on tasks.list_id = lists.id " +
            "where tasks.due_date between $1 and $2";
        const requestValues = [day, day];
        const result = await makeRequest(query, requestValues);
        return result.rows;
    }
}

module.exports = new TaskModel();