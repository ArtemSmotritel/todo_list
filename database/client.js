const { Client } = require('pg');

const client = new Client({
    user: "todolist_api",
    password: "abobus",
    host: "127.0.0.1",
    database: "my_database"
})

async function connectToDb() {
    await client.connect();
}

async function makeRequest(query, reqValues = []) {
    let data;
    try {
        data = await client.query(query, [...reqValues]);
    } catch (error) {
        console.log(error);
        throw 'database error';
    }

    return data;
}

module.exports = { client, connectToDb, makeRequest };