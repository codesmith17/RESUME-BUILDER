const { Client } = require('pg');

const client = new Client({
    user: 'Yash@2012',
    host: 'localhost',
    database: 'resumeDB',
    password: 'Yash@2012',
    port: 5432,
});

client.connect((err) => {
    if (err) {
        console.error('Error connecting to the database', err.stack);
    } else {
        console.log('Connected to the database');


        client.query(`
            CREATE TABLE IF NOT EXISTS resumes (
                resumeId SERIAL PRIMARY KEY,
                userName VARCHAR(100) NOT NULL,
                userEmail VARCHAR(100) NOT NULL,
                title TEXT NOT NULL
            )
        `, (err) => {
            if (err) {
                console.error('Error creating table', err.stack);
            } else {
                console.log('Table is successfully created');
            }
        });
    }
});

module.exports = client;