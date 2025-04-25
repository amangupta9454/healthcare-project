const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const {
  uploadDocument,
  getPatientDocuments,
  getDoctorDocuments,
  deleteDocument,
  getPatientsForDoctor,
} = require('../controllers/documentController');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', auth, upload.single('file'), uploadDocument);
router.get('/patient', auth, getPatientDocuments);
router.get('/doctor', auth, getDoctorDocuments);
router.delete('/:id', auth, deleteDocument);
router.get('/patients', auth, getPatientsForDoctor);

module.exports = router;