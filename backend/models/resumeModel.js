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
            CREATE EXTENSION IF NOT EXISTS pgcrypto;

            CREATE TABLE IF NOT EXISTS resumes (
                resumeId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                userName VARCHAR(100) NOT NULL,
                userEmail VARCHAR(100) NOT NULL,
                title TEXT NOT NULL
            );
        `, (err) => {
            if (err) {
                console.error('Error creating resumes table', err.stack);
            } else {
                console.log('Resumes table is successfully created');

                client.query(`
                    CREATE TABLE IF NOT EXISTS additional_info (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        resumeId UUID NOT NULL,
                        firstName VARCHAR(50) NOT NULL,
                        lastName VARCHAR(50) NOT NULL,
                        jobTitle VARCHAR(100) NOT NULL,
                        address TEXT NOT NULL,
                        phone VARCHAR(20) NOT NULL,
                        email VARCHAR(100) NOT NULL,
                        FOREIGN KEY (resumeId) REFERENCES resumes(resumeId) ON DELETE CASCADE
                    );
                `, (err) => {
                    if (err) {
                        console.error('Error creating additional_info table', err.stack);
                    } else {
                        console.log('Additional_info table is successfully created');

                        client.query(`
                            CREATE TABLE IF NOT EXISTS summaries (
                                summaryId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                resumeId UUID NOT NULL,
                                summary TEXT NOT NULL,
                                FOREIGN KEY (resumeId) REFERENCES resumes(resumeId) ON DELETE CASCADE
                            );
                        `, (err) => {
                            if (err) {
                                console.error('Error creating summaries table', err.stack);
                            } else {
                                console.log('Summaries table is successfully created');

                                client.query(`
                                    CREATE TABLE IF NOT EXISTS experience (
                                        experienceId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                        resumeId UUID NOT NULL,
                                        experience JSONB NOT NULL,
                                        FOREIGN KEY (resumeId) REFERENCES resumes(resumeId) ON DELETE CASCADE
                                    );
                                `, (err) => {
                                    if (err) {
                                        console.error('Error creating experience table', err.stack);
                                    } else {
                                        console.log('Experience table is successfully created');

                                        client.query(`
                                            CREATE TABLE IF NOT EXISTS education (
                                                educationId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                                resumeId UUID NOT NULL,
                                                education JSONB NOT NULL,
                                                FOREIGN KEY (resumeId) REFERENCES resumes(resumeId) ON DELETE CASCADE
                                            );
                                        `, (err) => {
                                            if (err) {
                                                console.error('Error creating education table', err.stack);
                                            } else {
                                                console.log('Education table is successfully created');
                                            }

                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});

module.exports = client;