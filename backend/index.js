const express = require('express');
const bodyParser = require('body-parser');
const resumeRoutes = require('./routes/resumeRoutes.js');
const cors = require("cors")
const app = express();
const port = 3000;
require('dotenv').config();

const corsOptions = {

    origin: 'http://localhost:5173',
};

app.use(cors(corsOptions));
// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/resumes', resumeRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});