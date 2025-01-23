const express = require('express');
const { add_member,get_active_members,get_members,delete_member,change_member_status} = require('../controllers/teamController');
const router = express.Router();

router.post('/add-member',add_member);
router.post('/get-active-members',get_active_members);
router.post('/get-all-member',get_members);
router.post('/change-member-status',change_member_status);
router.post('/delete-member',delete_member);

module.exports = router;
