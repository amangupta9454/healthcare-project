import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const Appointment = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    doctorId: '',
    name: '',
    email: '',
    mobile: '',
    gender: '',
    address: '',
    age: '',
    disease: '',
    date: '',
    message: '',
  });
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch registered doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/doctors');
        setDoctors(res.data);
      } catch (err) {
        setError('Failed to fetch doctors.');
      }
    };
    fetchDoctors();
  }, []);

  // Redirect to login if not a patient
  if (!user || user.role !== 'patient') {
    navigate('/login', { state: { message: 'Please register or log in as a patient to book an appointment.' } });
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.doctorId) return 'Please select a doctor.';
    if (!formData.name) return 'Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format.';
    if (!/^\d{10}$/.test(formData.mobile)) return 'Mobile number must be 10 digits.';
    if (!formData.gender) return 'Please select a gender.';
    if (!formData.address) return 'Address is required.';
    if (!formData.age || formData.age < 0 || formData.age > 150) return 'Invalid age.';
    if (!formData.disease) return 'Disease is required.';
    if (!formData.date) return 'Appointment date is required.';
    const selectedDate = new Date(formData.date);
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);
    if (selectedDate < today || selectedDate > maxDate) {
      return 'Appointment date must be within the next 30 days.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/appointments',
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setSuccess(res.data.message);
      setFormData({
        doctorId: '',
        name: '',
        email: '',
        mobile: '',
        gender: '',
        address: '',
        age: '',
        disease: '',
        date: '',
        message: '',
      });
      navigate('/patient-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment.');
    }
  };

  // Set min and max dates for the datetime-local input
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);
  const minDateStr = today.toISOString().slice(0, 16);
  const maxDateStr = maxDate.toISOString().slice(0, 16);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-200 via-blue-300 to-teal-400 p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md sm:max-w-4xl p-6 sm:p-8 lg:p-10 transition-all duration-300 animate-fade-in">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-8">Schedule Your Appointment</h2>
        {error && (
          <p className="text-center text-red-600 font-medium bg-red-50 p-4 rounded-xl mb-6 shadow-sm">{error}</p>
        )}
        {success && (
          <p className="text-center text-green-600 font-medium bg-green-50 p-4 rounded-xl mb-6 shadow-sm">{success}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Doctor</label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                pattern="[0-9]{10}"
                title="Mobile number must be 10 digits"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="0"
                max="150"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400 resize-y"
                rows="3"
                required
              ></textarea>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Disease</label>
              <textarea
                name="disease"
                value={formData.disease}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400 resize-y"
                rows="4"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Appointment Date</label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={minDateStr}
                max={maxDateStr}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message (Optional)</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400 resize-y"
                rows="4"
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white p-3 rounded-xl hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all duration-200 font-semibold transform hover:scale-105"
          >
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Appointment;