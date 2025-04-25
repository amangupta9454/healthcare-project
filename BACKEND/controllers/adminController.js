const Admin = require('../models/Admin');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP email
const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Admin Login OTP - HealthCare Clinic',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2c3e50; text-align: center;">Your OTP for Admin Login</h2>
        <p style="font-size: 16px; color: #34495e;">
          Dear Admin,<br/><br/>
          Your One-Time Password (OTP) for logging into the HealthCare Clinic Admin Panel is: <strong>${otp}</strong><br/>
          This OTP is valid for 10 minutes. Do not share it with anyone.
        </p>
        <p style="font-size: 16px; color: #34495e; text-align: center; margin-top: 20px;">
          Best Regards,<br/>
          HealthCare Clinic Team
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Login and send OTP
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = otp;
    admin.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await admin.save();

    // Send OTP
    await sendOtpEmail(email, otp);
    res.json({ message: 'OTP sent to your email.' });
  } catch (err) {
    console.error('Error in adminLogin:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Verify OTP and generate JWT
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email.' });
    }

    if (admin.otp !== otp || admin.otpExpires < Date.now()) {
      return res.status(401).json({ message: 'Invalid or expired OTP.' });
    }

    // Clear OTP
    admin.otp = undefined;
    admin.otpExpires = undefined;
    await admin.save();

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful.',
      token,
      admin: { email: admin.email, mobile: admin.mobile, role: admin.role },
    });
  } catch (err) {
    console.error('Error in verifyOtp:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update admin details
exports.updateAdminDetails = async (req, res) => {
  const { password, mobile } = req.body;

  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    if (password) admin.password = password;
    if (mobile) admin.mobile = mobile;

    await admin.save();
    res.json({ message: 'Admin details updated successfully.' });
  } catch (err) {
    console.error('Error in updateAdminDetails:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayAppointments = await Appointment.countDocuments({
      date: { $gte: today, $lt: tomorrow },
    });
    const totalAppointments = await Appointment.countDocuments();

    res.json({
      totalDoctors,
      totalPatients,
      todayAppointments,
      totalAppointments,
    });
  } catch (err) {
    console.error('Error in getAnalytics:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Manage doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' });
    res.json(doctors);
  } catch (err) {
    console.error('Error in getDoctors:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.removeDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found.' });
    }
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'Doctor removed successfully.' });
  } catch (err) {
    console.error('Error in removeDoctor:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.blockDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found.' });
    }
    doctor.isBlocked = true;
    await doctor.save();
    res.json({ message: 'Doctor blocked successfully.' });
  } catch (err) {
    console.error('Error in blockDoctor:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.editDoctor = async (req, res) => {
  const { name, age, gender, shortDesc, specialty, experience, qualifications } = req.body;

  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    if (name) doctor.name = name;
    if (age) doctor.age = age;
    if (gender) doctor.gender = gender;
    if (shortDesc) doctor.shortDesc = shortDesc;
    if (specialty) doctor.specialty = specialty;
    if (experience) doctor.experience = experience;
    if (qualifications) doctor.qualifications = qualifications;

    await doctor.save();
    res.json({ message: 'Doctor details updated successfully.' });
  } catch (err) {
    console.error('Error in editDoctor:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Manage patients
exports.getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' });
    res.json(patients);
  } catch (err) {
    console.error('Error in getPatients:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.removePatient = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ message: 'Patient not found.' });
    }
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'Patient removed successfully.' });
  } catch (err) {
    console.error('Error in removePatient:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.blockPatient = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ message: 'Patient not found.' });
    }
    patient.isBlocked = true;
    await patient.save();
    res.json({ message: 'Patient blocked successfully.' });
  } catch (err) {
    console.error('Error in blockPatient:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.unblockPatient = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ message: 'Patient not found.' });
    }
    patient.isBlocked = false;
    await patient.save();
    res.json({ message: 'Patient unblocked successfully.' });
  } catch (err) {
    console.error('Error in unblockPatient:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Manage appointments
exports.getRecentAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctor', 'name')
      .populate('patient', 'name')
      .sort({ date: -1 })
      .limit(5);
    res.json(appointments);
  } catch (err) {
    console.error('Error in getRecentAppointments:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    const doctor = await User.findById(appointment.doctor).select('name');
    const doctorName = doctor ? doctor.name : 'N/A';

    // Send cancellation email (reuses existing logic)
    await require('./appointmentController').sendAppointmentEmail(appointment, doctorName, 'cancelled');

    await Appointment.deleteOne({ _id: req.params.id });
    res.json({ message: 'Appointment cancelled successfully.' });
  } catch (err) {
    console.error('Error in cancelAppointment:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.rescheduleAppointment = async (req, res) => {
  const { date } = req.body;

  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    const selectedDate = new Date(date);
    const today = new Date();
    const maxDate = new Date(appointment.date);
    maxDate.setDate(maxDate.getDate() + 30);
    if (selectedDate < today || selectedDate > maxDate) {
      return res.status(400).json({ message: 'New date must be within 30 days from the original date.' });
    }

    appointment.date = date;
    await appointment.save();

    const doctor = await User.findById(appointment.doctor).select('name');
    const doctorName = doctor ? doctor.name : 'N/A';

    // Send reschedule email (reuses existing logic)
    await require('./appointmentController').sendAppointmentEmail(appointment, doctorName, 'rescheduled');

    res.json({ message: 'Appointment rescheduled successfully.' });
  } catch (err) {
    console.error('Error in rescheduleAppointment:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};