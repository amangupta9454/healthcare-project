import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [personalDetails, setPersonalDetails] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [rescheduleDate, setRescheduleDate] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setPersonalDetails(res.data))
      .catch((err) => setError('Failed to fetch personal details.'));

    axios
      .get('http://localhost:5000/api/appointments/patient', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setAppointments(res.data))
      .catch((err) => setError('Failed to fetch appointments.'));

    axios
      .get('http://localhost:5000/api/documents/patient', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setDocuments(res.data))
      .catch((err) => setError('Failed to fetch documents.'));
  }, []);

  const validateDate = (date, originalDate) => {
    const selectedDate = new Date(date);
    const today = new Date();
    const maxDate = new Date(originalDate);
    maxDate.setDate(maxDate.getDate() + 30);
    return selectedDate >= today && selectedDate <= maxDate;
  };

  const handleReschedule = async (appointmentId, originalDate) => {
    try {
      setError('');
      if (!rescheduleDate[appointmentId]) {
        setError('Please select a new date.');
        return;
      }
      if (!validateDate(rescheduleDate[appointmentId], originalDate)) {
        setError('Reschedule date must be within 30 days from the original appointment.');
        return;
      }
      await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}`,
        {
          date: rescheduleDate[appointmentId],
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setAppointments(
        appointments.map((app) =>
          app._id === appointmentId ? { ...app, date: rescheduleDate[appointmentId] } : app
        )
      );
      setRescheduleDate({ ...rescheduleDate, [appointmentId]: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reschedule appointment.');
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      setError('');
      await axios.delete(`http://localhost:5000/api/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAppointments(appointments.filter((app) => app._id !== appointmentId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel appointment. Please try again.');
    }
  };

  // Set min and max dates for the datetime-local input
  const getDateConstraints = (originalDate) => {
    const today = new Date();
    const maxDate = new Date(originalDate);
    maxDate.setDate(maxDate.getDate() + 30);
    return {
      min: today.toISOString().slice(0, 16),
      max: maxDate.toISOString().slice(0, 16),
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-blue-900 to-teal-800 py-8 sm:py-12 text-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {error && (
          <p className="text-center text-red-400 font-semibold bg-red-900/50 p-4 rounded-xl mb-6 shadow-md animate-pulse">
            {error}
          </p>
        )}
        <section className="mb-8 sm:mb-12 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-teal-200">Personal Details</h2>
          <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
              <p><span className="font-semibold text-teal-300">Name:</span> {personalDetails.name || 'N/A'}</p>
              <p><span className="font-semibold text-teal-300">Age:</span> {personalDetails.age || 'N/A'}</p>
              <p><span className="font-semibold text-teal-300">Gender:</span> {personalDetails.gender || 'N/A'}</p>
              <p><span className="font-semibold text-teal-300">Email:</span> {personalDetails.email || 'N/A'}</p>
              <p><span className="font-semibold text-teal-300">Mobile:</span> {personalDetails.mobile || 'N/A'}</p>
              <p><span className="font-semibold text-teal-300">Aadhar:</span> {personalDetails.aadhar || 'N/A'}</p>
            </div>
          </div>
        </section>

        <section className="mb-8 sm:mb-12 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-teal-200">Appointments</h2>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {appointments.map((app) => {
              const { min, max } = getDateConstraints(app.date);
              return (
                <div
                  key={app._id}
                  className="bg-gray-800 bg-opacity-80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  <div className="space-y-2 text-sm sm:text-base">
                    <p><span className="font-semibold text-teal-300">Doctor:</span> {app.doctor?.name || 'N/A'}</p>
                    <p><span className="font-semibold text-teal-300">Name:</span> {app.name}</p>
                    <p><span className="font-semibold text-teal-300">Email:</span> {app.email}</p>
                    <p><span className="font-semibold text-teal-300">Mobile:</span> {app.mobile}</p>
                    <p><span className="font-semibold text-teal-300">Gender:</span> {app.gender}</p>
                    <p><span className="font-semibold text-teal-300">Address:</span> {app.address}</p>
                    <p><span className="font-semibold text-teal-300">Age:</span> {app.age}</p>
                    <p><span className="font-semibold text-teal-300">Disease:</span> {app.disease}</p>
                    <p><span className="font-semibold text-teal-300">Date:</span> {new Date(app.date).toLocaleString()}</p>
                    <p><span className="font-semibold text-teal-300">Message:</span> {app.message || 'N/A'}</p>
                    <p><span className="font-semibold text-teal-300">Status:</span> {app.status}</p>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <input
                      type="datetime-local"
                      value={rescheduleDate[app._id] || ''}
                      onChange={(e) =>
                        setRescheduleDate({ ...rescheduleDate, [app._id]: e.target.value })
                      }
                      min={min}
                      max={max}
                      className="p-2 sm:p-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200"
                    />
                    <button
                      onClick={() => handleReschedule(app._id, app.date)}
                      className="bg-teal-600 text-white px-4 py-2 rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-200 transform hover:scale-105"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(app._id)}
                      className={`px-4 py-2 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200 transform hover:scale-105 ${
                        app.status === 'rejected'
                          ? 'bg-red-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                      disabled={app.status === 'rejected'}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-teal-200">Documents</h2>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="bg-gray-800 bg-opacity-80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="space-y-2 text-sm sm:text-base">
                  <p><span className="font-semibold text-teal-300">Name:</span> {doc.name}</p>
                  <p><span className="font-semibold text-teal-300">Doctor:</span> {doc.doctor?.name || 'N/A'}</p>
                  <p><span className="font-semibold text-teal-300">Type:</span> {doc.fileType}</p>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                  {doc.fileType === 'image' ? (
                    <img
                      src={doc.url}
                      alt={doc.name}
                      className="w-32 h-32 object-cover rounded-lg shadow-md"
                    />
                  ) : null}
                  <a
                    href={doc.url}
                    download
                    className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 transform hover:scale-105"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PatientDashboard;