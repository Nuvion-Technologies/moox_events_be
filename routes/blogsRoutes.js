const express = require('express');
const { add_event, change_event_status,get_active_events, get_events} = require('../controllers/blogsController');

const router = express.Router();

router.post('/add-blog', add_event);
router.post('/change-blog-status', change_event_status);
router.post('/get-blogs', get_events);
router.post('/get-all-blogs', get_active_events);
module.exports = router;