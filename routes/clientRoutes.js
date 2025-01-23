const express = require('express');
const { delete_client,add_service, change_status, get_services,get_active_services} = require('../controllers/clientController');

const router = express.Router();

router.post('/add-client', add_service);
router.post('/change-client-status', change_status);
router.post('/get-client', get_services);
router.post('/get-all-client', get_active_services);
router.post('/delete-client', delete_client);

module.exports = router;
