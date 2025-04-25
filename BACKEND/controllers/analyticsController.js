const Appointment = require('../models/Appointment');

exports.getAnalytics = async (req, res) => {
  try {
    // Get total appointments for the doctor
    const totalAppointments = await Appointment.countDocuments({ doctorId: req.user.id });

    // Get total unique patients for the doctor
    const uniquePatients = await Appointment.distinct('patientId', { doctorId: req.user.id });
    const totalPatients = uniquePatients.length;

    res.json({
      totalAppointments,
      totalPatients,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};