const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send appointment update email
const sendAppointmentEmail = async (appointment, doctorName, updateType) => {
  // Validate appointment data
  if (!appointment.email || !appointment.name) {
    console.error(`Cannot send email: Missing email or name for appointment ${appointment._id}`);
    return; // Skip email sending but don't throw error
  }

  let subject, message;
  switch (updateType) {
    case 'booked':
      subject = 'Appointment Confirmation - HealthCare Clinic';
      message = `
        Thank you for booking an appointment with HealthCare Clinic. We have successfully received your appointment request.
      `;
      break;
    case 'rescheduled':
      subject = 'Appointment Rescheduled - HealthCare Clinic';
      message = `
        Your appointment has been rescheduled. The new date and time are shown below.
      `;
      break;
    case 'confirmed':
      subject = 'Appointment Confirmed - HealthCare Clinic';
      message = `
        Your appointment has been confirmed by ${doctorName}. We look forward to seeing you!
      `;
      break;
    case 'rejected':
      subject = 'Appointment Rejected - HealthCare Clinic';
      message = `
        We regret to inform you that your appointment has been rejected by ${doctorName}. Please contact us or book another slot.
      `;
      break;
    case 'cancelled':
      subject = 'Appointment Cancelled - HealthCare Clinic';
      message = `
        Your appointment has been cancelled. If this was not intended, please contact us or book a new appointment.
      `;
      break;
    default:
      console.error(`Invalid update type: ${updateType}`);
      return; // Skip email sending for invalid updateType
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: appointment.email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2c3e50; text-align: center;">${subject}</h2>
        <p style="font-size: 16px; color: #34495e;">
          Dear ${appointment.name},<br/><br/>
          ${message}
        </p>
        <h3 style="color: #2c3e50;">Appointment Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f4f4f4;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Field</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Details</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Doctor</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${doctorName}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Patient Name</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${appointment.name}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Email</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${appointment.email}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Mobile</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${appointment.mobile}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Gender</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${appointment.gender}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Address</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${appointment.address}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Age</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${appointment.age}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Disease</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${appointment.disease}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Date & Time</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${new Date(appointment.date).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Message</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${appointment.message || 'N/A'}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Status</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${appointment.status || 'Pending'}</td>
          </tr>
        </table>
        <h3 style="color: #2c3e50;">Appointment Rules</h3>
        <ul style="font-size: 14px; color: #34495e; line-height: 1.6;">
          <li>Please arrive at least 15 minutes before your scheduled appointment time.</li>
          <li>Bring a valid photo ID and any relevant medical records.</li>
          <li>If you need to cancel or reschedule, please do so at least 24 hours in advance.</li>
          <li>Follow any pre-appointment instructions provided by your doctor.</li>
          <li>Contact our clinic at support@healthcareclinic.com for any queries.</li>
        </ul>
        <p style="font-size: 16px; color: #34495e; text-align: center; margin-top: 20px;">
          We look forward to assisting you!<br/>
          Best Regards,<br/>
          HealthCare Clinic Team
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending appointment ${updateType} email:`, error);
    // Don't throw error to avoid blocking appointment updates
  }
};

// Create appointment
const createAppointment = async (req, res) => {
  const { doctorId, name, email, mobile, gender, address, age, disease, date, message } = req.body;

  try {
    // Validate required fields
    if (!doctorId || !name || !email || !mobile || !gender || !address || !age || !disease || !date) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    // Validate mobile
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ message: 'Mobile number must be 10 digits.' });
    }

    // Validate age
    if (age < 0 || age > 150) {
      return res.status(400).json({ message: 'Invalid age.' });
    }

    // Validate date (within 30 days)
    const selectedDate = new Date(date);
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);
    if (selectedDate < today || selectedDate > maxDate) {
      return res.status(400).json({ message: 'Appointment date must be within the next 30 days.' });
    }

    // Validate doctorId and patient
    if (!mongoose.Types.ObjectId.isValid(doctorId) || !mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: 'Invalid doctor or patient ID.' });
    }

    const appointment = new Appointment({
      patient: req.user.id,
      doctor: doctorId,
      name,
      email,
      mobile,
      gender,
      address,
      age,
      disease,
      date,
      message,
    });

    await appointment.save();

    // Fetch doctor name for email
    const doctor = await mongoose.model('User').findById(doctorId).select('name');
    const doctorName = doctor ? doctor.name : 'N/A';

    // Send confirmation email
    await sendAppointmentEmail(appointment, doctorName, 'booked');

    res.status(201).json({ message: 'Appointment booked successfully.' });
  } catch (err) {
    console.error('Error in createAppointment:', err);
    res.status(500).json({ message: 'Server error while creating appointment.' });
  }
};

// Get patient appointments
const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('doctor', 'name')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    console.error('Error in getPatientAppointments:', err);
    res.status(500).json({ message: 'Server error while fetching appointments.' });
  }
};

// Get doctor appointments
const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate('patient', 'name email')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    console.error('Error in getDoctorAppointments:', err);
    res.status(500).json({ message: 'Server error while fetching appointments.' });
  }
};

// Update appointment
const updateAppointment = async (req, res) => {
  const { date, status } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid appointment ID.' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    // Validate user authorization
    if (appointment.patient.toString() !== req.user.id && appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this appointment.' });
    }

    // Track changes for email
    let updateType = null;

    // Validate and update date if provided
    if (date) {
      const selectedDate = new Date(date);
      const today = new Date();
      const maxDate = new Date(appointment.date);
      maxDate.setDate(maxDate.getDate() + 30);
      if (selectedDate < today || selectedDate > maxDate) {
        return res.status(400).json({ message: 'Appointment date must be within 30 days from the original date.' });
      }
      appointment.date = date;
      updateType = 'rescheduled';
    }

    // Update status if provided
    if (status) {
      if (!['pending', 'accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
      }
      appointment.status = status;
      updateType = status === 'accepted' ? 'confirmed' : 'rejected';
    }

    await appointment.save();

    // Fetch doctor name for email
    const doctor = await mongoose.model('User').findById(appointment.doctor).select('name');
    const doctorName = doctor ? doctor.name : 'N/A';

    // Send update email if there was a change
    if (updateType) {
      await sendAppointmentEmail(appointment, doctorName, updateType);
    }

    res.json({ message: 'Appointment updated successfully.' });
  } catch (err) {
    console.error('Error in updateAppointment:', err);
    res.status(500).json({ message: 'Server error while updating appointment.' });
  }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid appointment ID.' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    // Check if the user is authorized to delete (patient or doctor)
    if (appointment.patient.toString() !== req.user.id && appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this appointment.' });
    }

    // Fetch doctor name for email
    const doctor = await mongoose.model('User').findById(appointment.doctor).select('name');
    const doctorName = doctor ? doctor.name : 'N/A';

    // Send cancellation email before deletion
    await sendAppointmentEmail(appointment, doctorName, 'cancelled');

    await Appointment.deleteOne({ _id: req.params.id });
    res.json({ message: 'Appointment deleted successfully.' });
  } catch (err) {
    console.error('Error in deleteAppointment:', err);
    res.status(500).json({ message: 'Server error while deleting appointment.' });
  }
};

// Export all functions
module.exports = {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointment,
  deleteAppointment,
  sendAppointmentEmail,
};