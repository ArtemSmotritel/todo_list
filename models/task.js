const { client } = require('../database/client');

class TaskModel {
    async find(listId, done) {
        let list;
        try {
            const data = await client.query("select * from tasks where list_id=$1 and (done=false or done=$2)", [listId, done]);
            if (data.rowCount == 0) {
                return 'error';
            }
            list = data.rows;
        } catch (error) {
            console.log(error);
        }

        return list;
    }
    async findById(id) {
        let task;
        try {
            const data = await client.query("select * from tasks where id=$1", [id]);
            task = data.rows[0];
        } catch (error) {
            console.log(error);
        }

        return task;
    }
    async create(listId, newTask) {
        try {
            const requestValues = [newTask.description, newTask.done || false, listId, newTask.dueDate || new Date()];
            const data = await client.query("insert into tasks (description, done, list_id, due_date) values ($1, $2, $3, $4)", requestValues);
        } catch (error) {
            console.log(error);
        }

        return (await this.find(listId)).slice(-1)[0]; // returning the last added task to the list 
    }
    async partialUpdateById(id, update) {
        try {
            const { list_id, description, due_date } = await this.findById(id);
            const requestValues = [update.description || description, update.done || false, update.listId || list_id, update.dueDate || due_date, id];
            await client.query("update tasks set description = $1, done = $2, list_id = $3, due_date = $4 where id=$5", requestValues);
        } catch (error) {
            console.log(error);
        }

        return this.findById(id);
    }
    async replaceById(id, update) {
        const requestValues = [update.description || 'default task', update.done || false, update.listId || 1, update.dueDate || new Date(), id];
        try {
            await client.query("update tasks set description = $1, done = $2, list_id = $3, due_date = $4 where id=$5", requestValues);
        } catch (error) {
            console.log(error);
        }

        return this.findById(id);
    }
    async deleteById(id) {
        try {
            await client.query("delete from tasks where id=$1", [id]);
        } catch (error) {
            console.log(error);
        }
    }
    async countTasksToday() {
        let result;
        const today = new Date();
        try {
            const taskCount = await client
                .query("select count(*) from tasks " +
                    "where due_date between $1 and $2", [today, today]);
            const taskCountByList = await client
                .query("select count(tasks.id) as tasks_count, lists.name as list_name " +
                    "from tasks right join lists on tasks.list_id = lists.id " +
                    "where tasks.done = false group by lists.name");
            
            result = {
                tasks_for_today: taskCount.rows[0],
                undone_tasks_by_list: taskCountByList.rows,
            };
        } catch (error) {
            console.log(error);
        }

        return result;
    }
    async tasksForTheDay(day) {
        let result;
        try {
            const data = await client
                .query("select tasks.description, tasks.done, tasks.id, lists.name as list_name " +
                    "from tasks right join lists on tasks.list_id = lists.id " + 
                    "where tasks.due_date between $1 and $2", [day, day]);
            result = data.rows;
        } catch (error) {
            console.log(error);
        }

        return result;
    }
}

module.exports = new TaskModel(); //ex