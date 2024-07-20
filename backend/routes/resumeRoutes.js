const express = require('express');
const { createResume, getResumes, upsertAdditionalInfo, getAdditionalInfoById, updateSummary, getSummaryById, aiGenSummary } = require('../controllers/resumeControllers');

const router = express.Router();

router.post('/createResume', createResume);
router.get("/getResumes/:email", getResumes);
router.put("/upsertAdditionalInfo", upsertAdditionalInfo);
router.get("/getAdditionalInfoById/:resumeId", getAdditionalInfoById);
router.put("/updateSummary", updateSummary);
router.get("/getSummaryById/:resumeId", getSummaryById);
router.get("/aiGenSummary/:aiParameter", aiGenSummary);
module.exports = router;