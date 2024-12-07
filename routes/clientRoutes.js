const express = require('express');
const { add_service, change_status, get_services,get_active_services} = require('../controllers/clientController');

const router = express.Router();

router.post('/add-client', add_service);
router.post('/change-client-status', change_status);
router.post('/get-client', get_services);
router.post('/get-all-client', get_active_services);
module.exports = router;
