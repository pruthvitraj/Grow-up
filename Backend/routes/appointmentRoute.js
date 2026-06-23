const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');

router.post('/request', auth, appointmentController.requestMeeting);
router.get('/', auth, appointmentController.getAppointments);
router.put('/:id/status', auth, appointmentController.updateStatus);
router.put('/:id/meeting-link', auth, appointmentController.updateMeetingLink);

module.exports = router;
