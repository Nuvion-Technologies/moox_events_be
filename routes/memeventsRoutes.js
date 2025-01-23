const express = require('express');
const { add_event,delete_events, change_event_status,get_active_events, get_events} = require('../controllers/memeventsController');

const router = express.Router();

router.post('/add-event', add_event);
router.post('/change-event-status', change_event_status);
router.post('/get-events', get_events);
router.post('/delete-events', delete_events);
router.post('/get-all-events', get_active_events);
module.exports = router;
