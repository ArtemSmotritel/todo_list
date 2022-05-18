const app = require('./app');

const server = app.listen(3001, () => {
    console.log('Server is listening on 3001');
});