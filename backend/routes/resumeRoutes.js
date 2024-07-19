const express = require('express');
const { createResume, getResumes, upsertAdditionalInfo, getAdditionalInfoById } = require('../controllers/resumeControllers');

const router = express.Router();

router.post('/createResume', createResume);
router.get("/getResumes/:email", getResumes);
router.put("/upsertAdditionalInfo", upsertAdditionalInfo);
router.get("/getAdditionalInfoById/:resumeId", getAdditionalInfoById);
module.exports = router;