import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem('admin')) || {});
  const [analytics, setAnalytics] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [editAdmin, setEditAdmin] = useState({ password: '', mobile: '' });
  const [editDoctor, setEditDoctor] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Fetch analytics
    axios
      .get('https://mern-healthcare.onrender.com/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAnalytics(res.data))
      .catch((err) => setError('Failed to fetch analytics.'));

    // Fetch doctors
    axios
      .get('https://mern-healthcare.onrender.com/api/admin/doctors', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDoctors(res.data))
      .catch((err) => setError('Failed to fetch doctors.'));

    // Fetch patients
    axios
      .get('https://mern-healthcare.onrender.com/api/admin/patients', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPatients(res.data))
      .catch((err) => setError('Failed to fetch patients.'));

    // Fetch recent appointments
    axios
      .get('https://mern-healthcare.onrender.com/api/admin/appointments/recent', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAppointments(res.data))
      .catch((err) => setError('Failed to fetch appointments.'));
  }, [navigate]);

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.put(
        'https://mern-healthcare.onrender.com/api/admin/update',
        editAdmin,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAdmin({ ...admin, mobile: editAdmin.mobile });
      localStorage.setItem('admin', JSON.stringify({ ...admin, mobile: editAdmin.mobile }));
      setEditAdmin({ password: '', mobile: '' });
      alert('Admin details updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update admin details.');
    }
  };

  const handleEditDoctor = async (id) => {
    setError('');
    try {
      await axios.put(
        `https://mern-healthcare.onrender.com/api/admin/doctors/${id}/edit`,
        editDoctor,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setDoctors(doctors.map((doc) => (doc._id === id ? { ...doc, ...editDoctor } : doc)));
      setEditDoctor(null);
      alert('Doctor details updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update doctor details.');
    }
  };

  const handleRemoveDoctor = async (id) => {
    setError('');
    try {
      await axios.delete(`https://mern-healthcare.onrender.com/api/admin/doctors/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setDoctors(doctors.filter((doc) => doc._id !== id));
      alert('Doctor removed successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove doctor.');
    }
  };

  const handleBlockDoctor = async (id) => {
    setError('');
    try {
      await axios.put(
        `https://mern-healthcare.onrender.com/api/admin/doctors/${id}/block`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setDoctors(doctors.map((doc) => (doc._id === id ? { ...doc, isBlocked: true } : doc)));
      alert('Doctor blocked successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to block doctor.');
    }
  };

  const handleRemovePatient = async (id) => {
    setError('');
    try {
      await axios.delete(`https://mern-healthcare.onrender.com/api/admin/patients/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPatients(patients.filter((pat) => pat._id !== id));
      alert('Patient removed successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove patient.');
    }
  };

  const handleBlockPatient = async (id) => {
    setError('');
    try {
      await axios.put(
        `https://mern-healthcare.onrender.com/api/admin/patients/${id}/block`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPatients(patients.map((pat) => (pat._id === id ? { ...pat, isBlocked: true } : pat)));
      alert('Patient blocked successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to block patient.');
    }
  };

  const handleUnblockPatient = async (id) => {
    setError('');
    try {
      await axios.put(
        `https://mern-healthcare.onrender.com/api/admin/patients/${id}/unblock`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPatients(patients.map((pat) => (pat._id === id ? { ...pat, isBlocked: false } : pat)));
      alert('Patient unblocked successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unblock patient.');
    }
  };

  const handleCancelAppointment = async (id) => {
    setError('');
    try {
      await axios.delete(`https://mern-healthcare.onrender.com/api/admin/appointments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAppointments(appointments.filter((app) => app._id !== id));
      alert('Appointment cancelled successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel appointment.');
    }
  };

  const handleRescheduleAppointment = async (id, originalDate) => {
    setError('');
    try {
      const newDate = rescheduleDate[id];
      if (!newDate) {
        setError('Please select a new date.');
        return;
      }
      const selectedDate = new Date(newDate);
      const today = new Date();
      const maxDate = new Date(originalDate);
      maxDate.setDate(maxDate.getDate() + 30);
      if (selectedDate < today || selectedDate > maxDate) {
        setError('New date must be within 30 days from the original date.');
        return;
      }

      await axios.put(
        `https://mern-healthcare.onrender.com/api/admin/appointments/${id}/reschedule`,
        { date: newDate },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAppointments(
        appointments.map((app) =>
          app._id === id ? { ...app, date: newDate } : app
        )
      );
      setRescheduleDate({ ...rescheduleDate, [id]: '' });
      alert('Appointment rescheduled successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reschedule appointment.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-teal-800 py-6 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-0">Admin Dashboard</h2>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
        {error && <p className="text-red-400 text-center mb-4 text-sm sm:text-base">{error}</p>}

        {/* Section 1: Admin Details */}
        <section className="mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">Admin Details</h3>
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <p><strong>Email:</strong> {admin.email}</p>
              <p><strong>Mobile:</strong> {admin.mobile}</p>
              <p><strong>Role:</strong> {admin.role}</p>
            </div>
            <form onSubmit={handleUpdateAdmin} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm sm:text-base">New Password</label>
                <input
                  type="password"
                  value={editAdmin.password}
                  onChange={(e) => setEditAdmin({ ...editAdmin, password: e.target.value })}
                  className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm sm:text-base">Mobile</label>
                <input
                  type="text"
                  value={editAdmin.mobile}
                  onChange={(e) => setEditAdmin({ ...editAdmin, mobile: e.target.value })}
                  className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all text-sm sm:text-base"
              >
                Update Details
              </button>
            </form>
          </div>
        </section>

        {/* Section 2: Analytics */}
        <section className="mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">Analytics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl text-center">
              <h4 className="text-base sm:text-lg font-semibold text-gray-800">Total Doctors</h4>
              <p className="text-2xl sm:text-3xl font-bold text-teal-600">{analytics.totalDoctors || 0}</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl text-center">
              <h4 className="text-base sm:text-lg font-semibold text-gray-800">Total Patients</h4>
              <p className="text-2xl sm:text-3xl font-bold text-teal-600">{analytics.totalPatients || 0}</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl text-center">
              <h4 className="text-base sm:text-lg font-semibold text-gray-800">Today’s Appointments</h4>
              <p className="text-2xl sm:text-3xl font-bold text-teal-600">{analytics.todayAppointments || 0}</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl text-center">
              <h4 className="text-base sm:text-lg font-semibold text-gray-800">Total Appointments</h4>
              <p className="text-2xl sm:text-3xl font-bold text-teal-600">{analytics.totalAppointments || 0}</p>
            </div>
          </div>
        </section>

        {/* Section 3: Doctors */}
        <section className="mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">Doctors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
                <h4 className="text-base sm:text-lg font-semibold text-gray-800">{doctor.name}</h4>
                <p className="text-gray-600 text-sm sm:text-base"><strong>Email:</strong> {doctor.email}</p>
                <p className="text-gray-600 text-sm sm:text-base"><strong>Specialty:</strong> {doctor.specialty}</p>
                <p className="text-gray-600 text-sm sm:text-base"><strong>Experience:</strong> {doctor.experience}</p>
                <p className="text-gray-600 text-sm sm:text-base"><strong>Qualifications:</strong> {doctor.qualifications}</p>
                <p className="text-gray-600 text-sm sm:text-base"><strong>Status:</strong> {doctor.isBlocked ? 'Blocked' : 'Active'}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setEditDoctor(doctor)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemoveDoctor(doctor._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm sm:text-base"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => handleBlockDoctor(doctor._id)}
                    className="bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700 text-sm sm:text-base"
                    disabled={doctor.isBlocked}
                  >
                    Block
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Edit Doctor Form */}
        {editDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-4 sm:p-6 rounded-2xl w-full max-w-md sm:max-w-lg max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Edit Doctor</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditDoctor(editDoctor._id);
                }}
                className="space-y-3 sm:space-y-4"
              >
                <div>
                  <label className="block text-gray-700 text-sm sm:text-base">Name</label>
                  <input
                    type="text"
                    value={editDoctor.name}
                    onChange={(e) => setEditDoctor({ ...editDoctor, name: e.target.value })}
                    className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm sm:text-base">Age</label>
                  <input
                    type="number"
                    value={editDoctor.age}
                    onChange={(e) => setEditDoctor({ ...editDoctor, age: e.target.value })}
                    className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm sm:text-base">Gender</label>
                  <input
                    type="text"
                    value={editDoctor.gender}
                    onChange={(e) => setEditDoctor({ ...editDoctor, gender: e.target.value })}
                    className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm sm:text-base">Short Description</label>
                  <input
                    type="text"
                    value={editDoctor.shortDesc}
                    onChange={(e) => setEditDoctor({ ...editDoctor, shortDesc: e.target.value })}
                    className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm sm:text-base">Specialty</label>
                  <input
                    type="text"
                    value={editDoctor.specialty}
                    onChange={(e) => setEditDoctor({ ...editDoctor, specialty: e.target.value })}
                    className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm sm:text-base">Experience</label>
                  <input
                    type="text"
                    value={editDoctor.experience}
                    onChange={(e) => setEditDoctor({ ...editDoctor, experience: e.target.value })}
                    className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm sm:text-base">Qualifications</label>
                  <input
                    type="text"
                    value={editDoctor.qualifications}
                    onChange={(e) => setEditDoctor({ ...editDoctor, qualifications: e.target.value })}
                    className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 text-sm sm:text-base"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditDoctor(null)}
                    className="w-full sm:w-auto bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Section 4: Patients */}
        <section className="mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">Patients</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((patient) => (
              <div key={patient._id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
                <h4 className="text-base sm:text-lg font-semibold text-gray-800">{patient.name}</h4>
                <p className="text-gray-600 text-sm sm:text-base"><strong>Email:</strong> {patient.email}</p>
                <p className="text-gray-600 text-sm sm:text-base"><strong>Mobile:</strong> {patient.mobile}</p>
                <p className="text-gray-600 text-sm sm:text-base"><strong>Status:</strong> {patient.isBlocked ? 'Blocked' : 'Active'}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleRemovePatient(patient._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm sm:text-base"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => handleBlockPatient(patient._id)}
                    className="bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700 text-sm sm:text-base"
                    disabled={patient.isBlocked}
                  >
                    Block
                  </button>
                  <button
                    onClick={() => handleUnblockPatient(patient._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 text-sm sm:text-base"
                    disabled={!patient.isBlocked}
                  >
                    Unblock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Recent Appointments */}
        <section className="mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">Recent Appointments</h3>
          <div className="grid grid-cols-1 gap-4">
            {appointments.map((app) => (
              <div key={app._id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
                <h4 className="text-base sm:text-lg font-semibold text-gray-800">Patient: {app.patient?.name}</h4>
                <p className="text-gray-600 text-sm sm:text-base"><strong>Doctor:</strong> {app.doctor?.name}</p>
                <p className="text-gray-600 text-sm sm:text-base"><strong>Date:</strong> {new Date(app.date).toLocaleString()}</p>
                <p className="text-gray-600 text-sm sm:text-base"><strong>Status:</strong> {app.status}</p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <input
                    type="datetime-local"
                    value={rescheduleDate[app._id] || ''}
                    onChange={(e) =>
                      setRescheduleDate({ ...rescheduleDate, [app._id]: e.target.value })
                    }
                    className="w-full sm:w-auto p-2 border rounded-lg text-sm sm:text-base"
                  />
                  <button
                    onClick={() => handleCancelAppointment(app._id)}
                    className="w-full sm:w-auto bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRescheduleAppointment(app._id, app.date)}
                    className="w-full sm:w-auto bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;