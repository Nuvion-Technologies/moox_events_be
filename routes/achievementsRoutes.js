const express = require('express');
const { add_ach, change_ach_status,get_active_ach, get_ach} = require('../controllers/achievementsController');

const router = express.Router();

router.post('/add-achievements', add_ach);
router.post('/change-achievements-status', change_ach_status);
router.post('/get-achievements', get_ach);
router.post('/get-all-achievements', get_active_ach);
module.exports = router;
