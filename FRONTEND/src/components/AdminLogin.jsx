import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/admin/login', { email, password });
      setIsOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/admin/verify-otp', { email, otp });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('admin', JSON.stringify(res.data.admin));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-teal-800">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {!isOtpSent ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700 transition-all"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-gray-700">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700 transition-all"
            >
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;