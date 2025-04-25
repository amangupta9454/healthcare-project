const express = require('express');
const router = express.Router();
const {
  adminLogin,
  verifyOtp,
  updateAdminDetails,
  getAnalytics,
  getDoctors,
  removeDoctor,
  blockDoctor,
  editDoctor,
  getPatients,
  removePatient,
  blockPatient,
  unblockPatient,
  getRecentAppointments,
  cancelAppointment,
  rescheduleAppointment,
} = require('../controllers/adminController');
const auth = require('../middleware/auth'); // Assumes existing auth middleware

router.post('/login', adminLogin);
router.post('/verify-otp', verifyOtp);
router.put('/update', auth, updateAdminDetails);
router.get('/analytics', auth, getAnalytics);
router.get('/doctors', auth, getDoctors);
router.delete('/doctors/:id', auth, removeDoctor);
router.put('/doctors/:id/block', auth, blockDoctor);
router.put('/doctors/:id/edit', auth, editDoctor);
router.get('/patients', auth, getPatients);
router.delete('/patients/:id', auth, removePatient);
router.put('/patients/:id/block', auth, blockPatient);
router.put('/patients/:id/unblock', auth, unblockPatient);
router.get('/appointments/recent', auth, getRecentAppointments);
router.delete('/appointments/:id', auth, cancelAppointment);
router.put('/appointments/:id/reschedule', auth, rescheduleAppointment);

module.exports = router;