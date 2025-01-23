const express = require('express');
const { add_service,update_service, change_status,delete_status,get_active_services, get_services, get_all_services} = require('../controllers/serviceController');


const router = express.Router();

router.post('/add-service', add_service);
router.post('/change-service-status', change_status);
router.post('/get-service', get_services);
router.get('/get-active-services', get_active_services);
router.get('/services', get_all_services);
router.post('/delete-service', delete_status);
router.post('/update-service', update_service);
module.exports = router;
