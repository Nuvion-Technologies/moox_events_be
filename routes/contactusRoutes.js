const express = require('express');
const { getContactUs, change_query_status, add_query} = require('../controllers/contactusController');


const router = express.Router();


router.post('/change-query-status', change_query_status);
router.post('/get-queries', getContactUs);
router.post('/add-queries', add_query);

module.exports = router;
