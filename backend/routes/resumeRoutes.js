const express = require('express');
const { createResume, getResumes, upsertAdditionalInfo, getAdditionalInfoById, updateSummary, getSummaryById, aiGenSummary, upsertExperience, getExperience, upsertEducation, getEducation, upsertSkills, getSkills } = require('../controllers/resumeControllers');

const router = express.Router();

router.post('/createResume', createResume);
router.get("/getResumes/:email", getResumes);

router.get("/getAdditionalInfoById/:resumeId", getAdditionalInfoById);
router.put("/updateSummary", updateSummary);
router.get("/getSummaryById/:resumeId", getSummaryById);
router.get("/aiGenSummary/:aiParameter", aiGenSummary);
router.put("/upsertExperience", upsertExperience);
router.get("/getExperience/:resumeId", getExperience);
router.put("/upsertAdditionalInfo", upsertAdditionalInfo);
router.get("/getEducation/:resumeId", getEducation);
router.put("/upsertEducation", upsertEducation);
router.put("/upsertSkills", upsertSkills);
router.get("/getSkills/:resumeId", getSkills)
module.exports = router;