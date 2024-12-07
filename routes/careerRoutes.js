const express = require("express");
const router = express.Router();
const { addpos,all, application_pos, status_career, apply_pos, active_career} = require('../controllers/careerController');

router.post('/add-position',addpos);
router.post('/applications', application_pos);
router.post('/toggle', status_career);
router.post('/apply', apply_pos);
router.post('/all', all);
router.post('/jobs', active_career);
module.exports = router;
