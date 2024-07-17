const express = require('express');
const { createResume } = require('../controllers/resumeControllers');

const router = express.Router();

router.post('/createResume', createResume);

module.exports = router;