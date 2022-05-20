const knex = require('knex')({
    client: 'pg',
    connection: {
        user: "todolist_api",
        password: "abobus",
        host: "127.0.0.1",
        database: "my_database"
    }
});

module.exports = { knex };