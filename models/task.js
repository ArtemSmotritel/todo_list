const { client } = require('../database/client');

class TaskModel {
    async find(listId) {
        let list;
        try {
            const data = await client.query("select * from tasks where list_id=$1", [listId]);
            if (data.rowCount == 0) {
                return 'noSuchList';
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
            const data = await client.query("insert into tasks (description, done, list_id) values ($1, $2, $3)", [newTask.description, newTask.done || false, listId]);
        } catch (error) {
            console.log(error);
        }
        return (await this.find(listId)).slice(-1)[0]; // returning the last added task to the list 
    }
    async partialUpdateById(id, update) {
        const { list_id, description } = await this.findById(id);
        const newData = [update.description || description, update.done || false, update.listId || list_id];
        try {
            await client.query("update tasks set description = $1, done = $2, list_id = $3 where id=$4", [...newData, id]);
        } catch (error) {
            console.log(error);
        }
        return this.findById(id);
    }
    async replaceById(id, update) {
        const newData = [update.description || 'default task', update.done || false, update.listId || 1];
        try {
            await client.query("update tasks set description = $1, done = $2, list_id = $3 where id=$4", [...newData, id]);
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
}

module.exports = new TaskModel();