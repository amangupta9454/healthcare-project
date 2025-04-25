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

    // Validate Aadhar
    if (!/^\d{12}$/.test(aadhar)) {
      return res.status(400).json({ message: 'Aadhar number must be 12 digits.' });
    }

    // Validate doctor-specific fields
    if (role === 'doctor' && (!shortDesc || !specialty || !experience || !qualifications)) {
      return res.status(400).json({ message: 'All doctor profile fields are required.' });
    }

    // Check for existing email
    const existingEmail = await User.findOne({ email });
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
      // Validate file size (1MB = 1 * 1024 * 1024 bytes)
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

    // Prepare user data
    const userData = {
      name,
      age,
      gender,
      role,
      email,
      mobile,
      aadhar,
      password: await bcrypt.hash(password, 10),
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
      subject: 'Registration OTP',
      text: `Your OTP for registration is: ${otp}`,
    });

    res.status(201).json({ message: 'OTP sent to email. Please verify.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.verifyRegOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'Registration successful. Please log in.' });
  } catch (err) {
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

    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: 'Login OTP',
      text: `Your OTP for login is: ${otp}`,
    });

    res.json({ message: 'OTP sent to email. Please verify.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, message: 'Login successful.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    });

    res.json({ message: 'OTP sent to email. Please verify.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. Please log in.' });
  } catch (err) {
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
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('name _id');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};