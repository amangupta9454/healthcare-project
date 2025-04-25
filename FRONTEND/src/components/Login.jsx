import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const Login = () => {
  const [form, setForm] = useState('login');
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [regData, setRegData] = useState({
    name: '',
    age: '',
    gender: '',
    role: 'patient',
    email: '',
    mobile: '',
    aadhar: '',
    password: '',
    img: null,
    shortDesc: '',
    specialty: '',
    experience: '',
    qualifications: '',
  });
  const [regOtp, setRegOtp] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { role, email, password });
      setMessage(res.data.message);
      setForm('otp');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      login(res.data.token);
      setMessage(res.data.message);
      navigate(role === 'patient' ? '/patient-dashboard' : '/doctor-dashboard');
      setForm('login');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Invalid OTP');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(res.data.message);
      setForm('reset');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error sending OTP');
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', { email, otp, newPassword });
      setMessage(res.data.message);
      setForm('login');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error resetting password');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(regData).forEach((key) => {
        if (key === 'img' && regData[key]) {
          formData.append('img', regData[key]);
        } else if (regData[key]) {
          formData.append(key, regData[key]);
        }
      });

      const res = await axios.post('http://localhost:5000/api/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message);
      setForm('reg-otp');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  const verifyRegOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-reg-otp', { email: regData.email, otp: regOtp });
      setMessage(res.data.message);
      setForm('login');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Invalid OTP');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        setMessage('Image size must be less than 1MB.');
        return;
      }
      setRegData({ ...regData, img: file });
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen md:min-h-[40vh] flex items-center justify-center bg-gradient-to-br from-violet-900 via-cyan-900 to-indigo-800 p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md sm:max-w-2xl p-6 sm:p-8 lg:p-10 transition-all duration-300">
        {form === 'login' && (
          <>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-8">Welcome Back</h2>
            <div onSubmit={handleLogin} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                    required
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                onClick={handleLogin}
                className="w-full bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200 font-semibold"
              >
                Login
              </button>
            </div>
            <div className="text-center mt-6 space-y-3">
              <button
                onClick={() => setForm('forgot')}
                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-all duration-200"
              >
                Forgot Password?
              </button>
              <p className="text-sm text-gray-600">
                New user?{' '}
                <button
                  onClick={() => setForm('register')}
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition-all duration-200"
                >
                  Register
                </button>
              </p>
            </div>
          </>
        )}

        {form === 'otp' && (
          <>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-8">Verify OTP</h2>
            <div onSubmit={verifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                  required
                />
              </div>
              <button
                type="submit"
                onClick={verifyOtp}
                className="w-full bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200 font-semibold"
              >
                Verify
              </button>
            </div>
          </>
        )}

        {form === 'forgot' && (
          <>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-8">Forgot Password</h2>
            <div onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                  required
                />
              </div>
              <button
                type="submit"
                onClick={handleForgotPassword}
                className="w-full bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200 font-semibold"
              >
                Send OTP
              </button>
            </div>
            <p className="text-center mt-6">
              Back to{' '}
              <button
                onClick={() => setForm('login')}
                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-all duration-200"
              >
                Login
              </button>
            </p>
          </>
        )}

        {form === 'reset' && (
          <>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-8">Reset Password</h2>
            <div onSubmit={resetPassword} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                onClick={resetPassword}
                className="w-full bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200 font-semibold"
              >
                Reset
              </button>
            </div>
          </>
        )}

        {form === 'register' && (
          <>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-8">Create Account</h2>
            <div onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={regData.role}
                    onChange={(e) => setRegData({ ...regData, role: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                    required
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                    required
                  />
                </div>
                {regData.role === 'doctor' && (
                  <>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image (Max 1MB)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                      <input
                        type="text"
                        value={regData.shortDesc}
                        onChange={(e) => setRegData({ ...regData, shortDesc: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                      <input
                        type="text"
                        value={regData.specialty}
                        onChange={(e) => setRegData({ ...regData, specialty: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                      <input
                        type="text"
                        value={regData.experience}
                        onChange={(e) => setRegData({ ...regData, experience: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                      <input
                        type="text"
                        value={regData.qualifications}
                        onChange={(e) => setRegData({ ...regData, qualifications: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                        required
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={regData.age}
                    onChange={(e) => setRegData({ ...regData, age: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={regData.gender}
                    onChange={(e) => setRegData({ ...regData, gender: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input
                    type="tel"
                    value={regData.mobile}
                    onChange={(e) => setRegData({ ...regData, mobile: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar (12 digits)</label>
                  <input
                    type="text"
                    value={regData.aadhar}
                    onChange={(e) => setRegData({ ...regData, aadhar: e.target.value })}
                    pattern="[0-9]{12}"
                    title="Aadhar must be 12 digits"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                onClick={handleRegister}
                className="w-full bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200 font-semibold"
              >
                Register
              </button>
            </div>
            <p className="text-center mt-6 text-sm text-gray-600">
              Already registered?{' '}
              <button
                onClick={() => setForm('login')}
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-all duration-200"
              >
                Login
              </button>
            </p>
          </>
        )}

        {form === 'reg-otp' && (
          <>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-8">Verify OTP</h2>
            <div onSubmit={verifyRegOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                <input
                  type="text"
                  value={regOtp}
                  onChange={(e) => setRegOtp(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                  required
                />
              </div>
              <button
                type="submit"
                onClick={verifyRegOtp}
                className="w-full bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200 font-semibold"
              >
                Verify
              </button>
            </div>
          </>
        )}

        {message && (
          <p className="text-center mt-6 text-red-600 font-medium bg-red-50 p-3 rounded-xl">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Login;