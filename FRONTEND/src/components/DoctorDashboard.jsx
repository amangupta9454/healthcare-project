import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [personalDetails, setPersonalDetails] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [file, setFile] = useState(null);
  const [docName, setDocName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [error, setError] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState({});

  useEffect(() => {
    axios
      .get('https://mern-healthcare.onrender.com/api/auth/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setPersonalDetails(res.data))
      .catch((err) => setError('Failed to fetch personal details.'));

    axios
      .get('https://mern-healthcare.onrender.com/api/appointments/doctor', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setAppointments(res.data))
      .catch((err) => setError('Failed to fetch appointments.'));

    axios
      .get('https://mern-healthcare.onrender.com/api/documents/doctor', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setDocuments(res.data))
      .catch((err) => setError('Failed to fetch documents.'));

    axios
      .get('https://mern-healthcare.onrender.com/api/documents/patients', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setPatients(res.data))
      .catch((err) => setError('Failed to fetch patients.'));
  }, []);

  const validateDate = (date, originalDate) => {
    const selectedDate = new Date(date);
    const today = new Date();
    const maxDate = new Date(originalDate);
    maxDate.setDate(maxDate.getDate() + 30);
    return selectedDate >= today && selectedDate <= maxDate;
  };

  const handleConfirm = async (appointmentId) => {
    try {
      setError('');
      await axios.put(
        `https://mern-healthcare.onrender.com/api/appointments/${appointmentId}`,
        { status: 'accepted' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAppointments(
        appointments.map((app) =>
          app._id === appointmentId ? { ...app, status: 'accepted' } : app
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm appointment.');
    }
  };

  const handleReject = async (appointmentId) => {
    try {
      setError('');
      await axios.put(
        `https://mern-healthcare.onrender.com/api/appointments/${appointmentId}`,
        { status: 'rejected' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAppointments(
        appointments.map((app) =>
          app._id === appointmentId ? { ...app, status: 'rejected' } : app
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject appointment.');
    }
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
        `https://mern-healthcare.onrender.com/api/appointments/${appointmentId}`,
        { date: rescheduleDate[appointmentId] },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
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

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    if (!file || !docName || !patientId) {
      setError('Document name, patient, and file are required.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, JPEG, or PNG files are allowed.');
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      setError('File size must be less than 1MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', docName);
    formData.append('patientId', patientId);

    for (let [key, value] of formData.entries()) {
      console.log(`FormData ${key}:`, value);
    }

    try {
      const res = await axios.post('https://mern-healthcare.onrender.com/api/documents/upload', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setDocuments([...documents, res.data]);
      setFile(null);
      setDocName('');
      setPatientId('');
      document.querySelector('input[type="file"]').value = null;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload document.');
    }
  };

  const handleDelete = async (documentId) => {
    try {
      setError('');
      await axios.delete(`https://mern-healthcare.onrender.com/api/documents/${documentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setDocuments(documents.filter((doc) => doc._id !== documentId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete document.');
    }
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
            {personalDetails.img && (
              <div className="mb-6 flex justify-center">
                <img
                  src={personalDetails.img}
                  alt="Profile"
                  className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full shadow-md border-4 border-teal-500"
                />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
              <p><span className="font-semibold text-teal-300">Name:</span> {personalDetails.name || 'N/A'}</p>
              <p><span className="font-semibold text-teal-300">Age:</span> {personalDetails.age || 'N/A'}</p>
              <p><span className="font-semibold text-teal-300">Gender:</span> {personalDetails.gender || 'N/A'}</p>
              <p><span className="font-semibold text-teal-300">Email:</span> {personalDetails.email || 'N/A'}</p>
              <p><span className="font-semibold text-teal-300">Mobile:</span> {personalDetails.mobile || 'N/A'}</p>
              <p><span className="font-semibold text-teal-300">Aadhar:</span> {personalDetails.aadhar || 'N/A'}</p>
              {personalDetails.role === 'doctor' && (
                <>
                  <p className="sm:col-span-2"><span className="font-semibold text-teal-300">Short Description:</span> {personalDetails.shortDesc || 'N/A'}</p>
                  <p><span className="font-semibold text-teal-300">Specialty:</span> {personalDetails.specialty || 'N/A'}</p>
                  <p><span className="font-semibold text-teal-300">Experience:</span> {personalDetails.experience || 'N/A'}</p>
                  <p className="sm:col-span-2"><span className="font-semibold text-teal-300">Qualifications:</span> {personalDetails.qualifications || 'N/A'}</p>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="mb-8 sm:mb-12 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-teal-200">Appointments</h2>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {appointments.map((app) => {
              const { min, max } = {
                min: new Date().toISOString().slice(0, 16),
                max: new Date(new Date(app.date).setDate(new Date(app.date).getDate() + 30)).toISOString().slice(0, 16),
              };
              return (
                <div
                  key={app._id}
                  className="bg-gray-800 bg-opacity-80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  <div className="space-y-2 text-sm sm:text-base">
                    <p><span className="font-semibold text-teal-300">Patient Name:</span> {app.name}</p>
                    <p><span className="font-semibold text-teal-300">Patient Email:</span> {app.email}</p>
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
                        setRescheduleDate((prev) => ({
                          ...prev,
                          [app._id]: e.target.value,
                        }))
                      }
                      min={min}
                      max={max}
                      className="p-2 sm:p-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200"
                    />
                    <button
                      onClick={() => handleConfirm(app._id)}
                      className={`px-4 py-2 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 transform hover:scale-105 ${
                        app.status === 'accepted' || app.status === 'rejected'
                          ? 'bg-green-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                      disabled={app.status === 'accepted' || app.status === 'rejected'}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleReject(app._id)}
                      className={`px-4 py-2 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200 transform hover:scale-105 ${
                        app.status === 'accepted' || app.status === 'rejected'
                          ? 'bg-red-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                      disabled={app.status === 'accepted' || app.status === 'rejected'}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleReschedule(app._id, app.date)}
                      className="bg-teal-600 text-white px-4 py-2 rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-200 transform hover:scale-105"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-teal-200">Documents</h2>
          <form onSubmit={handleUpload} className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4 bg-gray-800 bg-opacity-80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg">
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="Document Name"
              className="p-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 flex-1"
              required
            />
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="p-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 flex-1"
              required
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name}
                </option>
              ))}
            </select>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
              className="p-3 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-200 flex-1"
              required
            />
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-200 transform hover:scale-105"
            >
              Upload
            </button>
          </form>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="bg-gray-800 bg-opacity-80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="space-y-2 text-sm sm:text-base">
                  <p><span className="font-semibold text-teal-300">Name:</span> {doc.name}</p>
                  <p><span className="font-semibold text-teal-300">Patient:</span> {doc.patient?.name || 'N/A'}</p>
                  <p><span className="font-semibold text-teal-300">Type:</span> {doc.fileType}</p>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  {doc.fileType === 'image' ? (
                    <img
                      src={doc.url}
                      alt={doc.name}
                      className="w-32 h-32 object-cover rounded-lg shadow-md"
                    />
                  ) : null}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                    <a
                      href={doc.url}
                      download
                      className="flex-1 sm:flex-none bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 transform hover:scale-105 text-center"
                    >
                      Download
                    </a>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="flex-1 sm:flex-none bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200 transform hover:scale-105 text-center"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DoctorDashboard;