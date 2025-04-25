const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');

router.post('/', auth, appointmentController.createAppointment);
router.get('/patient', auth, appointmentController.getPatientAppointments);
router.get('/doctor', auth, appointmentController.getDoctorAppointments);
router.put('/:id', auth, appointmentController.updateAppointment);
router.delete('/:id', auth, appointmentController.deleteAppointment);

module.exports = router;