const { get } = require('http');
const client = require('../models/resumeModel');

const createResume = async(req, res) => {
    const { userName, userEmail, title, resumeid } = req.body;

    try {
        const result = await client.query(
            'INSERT INTO resumes (userName, userEmail, title,resumeid) VALUES ($1, $2, $3,$4) RETURNING *', [userName, userEmail, title, resumeid]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const getResumes = async(req, res, next) => {
    const { email } = req.params;
    // console.log(typeof email);
    try {
        const result = await client.query('SELECT * FROM RESUMES WHERE useremail = $1', [email]);
        // console.log(result);
        res.status(200).json(result.rows);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const upsertAdditionalInfo = async(req, res, next) => {
    const { resumeId, firstName, lastName, jobTitle, address, phone, email, summary } = req.body;
    console.log(req.body);
    try {
        const result = await client.query(
            `WITH updated AS (
          UPDATE additional_info 
          SET firstname=$1, lastname=$2, jobtitle=$3, address=$4, phone=$5, email=$6, summary=$7 
          WHERE resumeid=$8
          RETURNING *
        )
        INSERT INTO additional_info (resumeid, firstname, lastname, jobtitle, address, phone, email, summary)
        SELECT $8, $1, $2, $3, $4, $5, $6, $7
        WHERE NOT EXISTS (SELECT 1 FROM updated)
        RETURNING *;`, [firstName, lastName, jobTitle, address, phone, email, resumeId, summary]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Resume not found" });
        }

        res.status(200).json({ message: "UPDATED SUCCESSFULLY!", data: result.rows[0] });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAdditionalInfoById = async(req, res, next) => {
    const { resumeId } = req.params;
    try {
        const result = await client.query(`SELECT * FROM additional_info WHERE resumeid=$1`, [resumeId]);
        res.status(200).json({ message: "FETCHED SSUCCESSFULLY", data: result.rows })
    } catch {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { createResume, getResumes, upsertAdditionalInfo, getAdditionalInfoById };