require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const documentRoutes = require('./routes/documentRoutes');
const connectDB = require('./config/db');
const multer = require('multer');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-domain.com'], // Add your frontend domains
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow necessary methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  credentials: true, // If using cookies or auth headers
}));

// Handle preflight OPTIONS requests
app.options('*', cors());
app.use(express.json());

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', upload.single('img'), authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/admin', adminRoutes);
// Initialize Admin (Run once manually or via script)
const Admin = require('./models/Admin');
const initializeAdmin = async () => {
  const adminExists = await Admin.findOne({ email: 'ag0567688@gmail.com' });
  if (!adminExists) {
    const admin = new Admin({
      email: 'ag0567688@gmail.com',
      password: 'Amangupta@11',
      mobile: '9560472926',
      role: 'admin',
    });
    await admin.save();
  }
};
initializeAdmin();
app.get("/", (req, res) => {
  res.send({"msg": "BACKEND HOSTED SUCCESSFULLY"});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));