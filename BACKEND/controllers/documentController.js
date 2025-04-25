const Document = require('../models/Document');
const Appointment = require('../models/Appointment');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier'); // Add this for streaming buffers

exports.uploadDocument = async (req, res) => {
  const { name, patientId } = req.body;

  try {

    // Validate required fields
    if (!name || !patientId || !req.file) {
      return res.status(400).json({ message: 'Document name, patient ID, and file are required.' });
    }

    // Validate file type (image only)
    const fileType = req.file.mimetype;
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(fileType)) {
      return res.status(400).json({ message: 'Only JPG, JPEG, or PNG files are allowed.' });
    }

    // Validate file size (1MB = 1 * 1024 * 1024 bytes)
    if (req.file.size > 1 * 1024 * 1024) {
      return res.status(400).json({ message: 'File size must be less than 1MB.' });
    }

    // Upload to Cloudinary using stream
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'prescriptions_images',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const document = new Document({
      name,
      url: result.secure_url,
      patient: patientId,
      doctor: req.user.id,
      fileType: 'image',
    });

    await document.save();
    res.status(201).json(document);
  } catch (err) {
    console.error('Error in uploadDocument:', err);
    res.status(500).json({ message: 'Server error while uploading document.' });
  }
};

exports.getPatientDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ patient: req.user.id })
      .populate('doctor', 'name')
      .sort({ createdAt: -1 });
    res.json(documents);
  } catch (err) {
    console.error('Error in getPatientDocuments:', err);
    res.status(500).json({ message: 'Server error while fetching documents.' });
  }
};

exports.getDoctorDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ doctor: req.user.id })
      .populate('patient', 'name')
      .sort({ createdAt: -1 });
    res.json(documents);
  } catch (err) {
    console.error('Error in getDoctorDocuments:', err);
    res.status(500).json({ message: 'Server error while fetching documents.' });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid document ID.' });
    }

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    if (document.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this document.' });
    }

    await Document.deleteOne({ _id: req.params.id });
    res.json({ message: 'Document deleted successfully.' });
  } catch (err) {
    console.error('Error in deleteDocument:', err);
    res.status(500).json({ message: 'Server error while deleting document.' });
  }
};

exports.getPatientsForDoctor = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate('patient', 'name')
      .select('patient');

    // Extract unique patients
    const patients = [...new Set(appointments.map(app => app.patient))]
      .filter(patient => patient) // Remove null/undefined patients
      .map(patient => ({ _id: patient._id, name: patient.name }));

    res.json(patients);
  } catch (err) {
    console.error('Error in getPatientsForDoctor:', err);
    res.status(500).json({ message: 'Server error while fetching patients.' });
  }
};