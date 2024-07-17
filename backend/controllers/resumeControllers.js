const client = require('../models/resumeModel');

const createResume = async(req, res) => {
    const { userName, userEmail, title } = req.body;

    try {
        const result = await client.query(
            'INSERT INTO resumes (userName, userEmail, title) VALUES ($1, $2, $3) RETURNING *', [userName, userEmail, title]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { createResume };