const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.register = async (req, res) => {
  const {
    name,
    age,
    gender,
    role,
    email,
    mobile,
    aadhar,
    password,
    shortDesc,
    specialty,
    experience,
    qualifications,
  } = req.body;

  try {
    // Validate required fields
    if (!name || !age || !gender || !role || !email || !password || !mobile || !aadhar) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Validate Aadhar
    if (!/^\d{12}$/.test(aadhar)) {
      return res.status(400).json({ message: 'Aadhar number must be 12 digits.' });
    }

    // Validate doctor-specific fields
    if (role === 'doctor' && (!shortDesc || !specialty || !experience || !qualifications)) {
      return res.status(400).json({ message: 'All doctor profile fields are required.' });
    }

    // Check for existing email
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
     
      return res.status(400).json({ message: 'Email already exists.' });
    }

    // Check for existing aadhar
    const existingAadhar = await User.findOne({ aadhar });
    if (existingAadhar) {
      
      return res.status(400).json({ message: 'Aadhar already exists.' });
    }

    // Handle image upload for doctors
    let imgUrl = '';
    if (role === 'doctor' && req.file) {
      if (req.file.size > 1 * 1024 * 1024) {
        return res.status(400).json({ message: 'Image size must be less than 1MB.' });
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'doctor_profiles',
        resource_type: 'image',
      });
      imgUrl = result.secure_url;
    } else if (role === 'doctor') {
      return res.status(400).json({ message: 'Profile image is required for doctors.' });
    }

    // Log password before hashing
   

    // Hash password (single hashing)
    const hashedPassword = await bcrypt.hash(password, 10);
   

    // Prepare user data
    const userData = {
      name,
      age,
      gender,
      role,
      email: email.toLowerCase(),
      mobile,
      aadhar,
      password: hashedPassword,
      ...(role === 'doctor' && { img: imgUrl, shortDesc, specialty, experience, qualifications }),
    };

    // Create new user
    const user = new User(userData);
    await user.save();

    // Send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: 'Registration OTP - HealthCare Clinic',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2c3e50; text-align: center;">Your OTP for Registration</h2>
          <p style="font-size: 16px; color: #34495e;">
            Dear ${name},<br/><br/>
            Your One-Time Password (OTP) for completing your registration with HealthCare Clinic is: <strong>${otp}</strong><br/>
            This OTP is valid for 10 minutes. Do not share it with anyone.
          </p>
          <p style="font-size: 16px; color: #34495e; text-align: center; margin-top: 20px;">
            Best Regards,<br/>
            HealthCare Clinic Team
          </p>
        </div>
      `,
    });

    res.status(201).json({ message: 'OTP sent to email. Please verify.' });
  } catch (err) {
    console.error('Error in register:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.verifyRegOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase(), otp, otpExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'Registration successful. Please log in.' });
  } catch (err) {
    console.error('Error in verifyRegOtp:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.login = async (req, res) => {
  const { role, email, password } = req.body;

  try {
    // Validate inputs
    if (!role || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase(), role });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: 'Login OTP - HealthCare Clinic',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2c3e50; text-align: center;">Your OTP for Login</h2>
          <p style="font-size: 16px; color: #34495e;">
            Dear ${user.name},<br/><br/>
            Your One-Time Password (OTP) for logging into HealthCare Clinic is: <strong>${otp}</strong><br/>
            This OTP is valid for 10 minutes. Do not share it with anyone.
          </p>
          <p style="font-size: 16px; color: #34495e; text-align: center; margin-top: 20px;">
            Best Regards,<br/>
            HealthCare Clinic Team
          </p>
        </div>
      `,
    });

    res.json({ message: 'OTP sent to email. Please verify.' });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase(), otp, otpExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, message: 'Login successful.', user: { id: user._id, role: user.role, email: user.email } });
  } catch (err) {
    console.error('Error in verifyOtp:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset OTP - HealthCare Clinic',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2c3e50; text-align: center;">Your OTP for Password Reset</h2>
          <p style="font-size: 16px; color: #34495e;">
            Dear ${user.name},<br/><br/>
            Your One-Time Password (OTP) for resetting your password is: <strong>${otp}</strong><br/>
            This OTP is valid for 10 minutes. Do not share it with anyone.
          </p>
          <p style="font-size: 16px; color: #34495e; text-align: center; margin-top: 20px;">
            Best Regards,<br/>
            HealthCare Clinic Team
          </p>
        </div>
      `,
    });

    res.json({ message: 'OTP sent to email. Please verify.' });
  } catch (err) {
    console.error('Error in forgotPassword:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase(), otp, otpExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. Please log in.' });
  } catch (err) {
    console.error('Error in resetPassword:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpires');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error in getMe:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('name _id');
    res.json(doctors);
  } catch (err) {
    console.error('Error in getDoctors:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};