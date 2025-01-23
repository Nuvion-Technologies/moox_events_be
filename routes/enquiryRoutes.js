const express = require('express');
const { getEnquiry, change_enquiry_status, add_enquiry} = require('../controllers/enquiryController');


const router = express.Router();


router.post('/change-enquiry-status', change_enquiry_status);
router.post('/get-enquiry', getEnquiry);
router.post('/add-enquiry', add_enquiry);

module.exports = router;
