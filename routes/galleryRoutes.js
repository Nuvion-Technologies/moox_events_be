const express = require('express');
const { add_service, change_status,get_active_services,delete_gallery, get_services} = require('../controllers/galleryController');

const router = express.Router();

router.post('/add-photo', add_service);
router.post('/change-photo-status', change_status);
router.post('/get-photos', get_services);
router.post('/get-all-photos', get_active_services);
router.post('/delete-photos', delete_gallery);

module.exports = router;
