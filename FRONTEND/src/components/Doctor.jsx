import { useState } from 'react';
import D1 from "../assets/D1.jpg";
import D2 from "../assets/D2.jpg";
import D3 from "../assets/D3.jpg";
import D4 from "../assets/D4.jpg";
import D5 from "../assets/D5.jpg";
import D6 from "../assets/D6.jpg";
import D7 from "../assets/D7.jpg";
import D8 from "../assets/D8.jpg";
import D9 from "../assets/D9.jpg";
import D10 from "../assets/D10.jpg";
import D11 from "../assets/D11.jpg";
import D12 from "../assets/D12.jpg";

const Doctor = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const doctors = [
    { id: 1, img: D1, name: "Dr. Aman Gupta", gender: "male", shortDesc: "Expert in heart care", age: 28, specialty: "Cardiology", experience: "5 years", qualifications: "MBBS, MD, FACC" },
    { id: 2, img: D2, name: "Dr. Indira Hinduja", gender: "female", shortDesc: "Teeth specialist", age: 28, specialty: "Neurology", experience: "5 years", qualifications: "MBBS, DM" },
    { id: 3, img: D3, name: "Dr. Ankita Yadav", gender: "female", shortDesc: "Plastic Surgon", age: 30, specialty: "Pediatrics", experience: "7 years", qualifications: "MBBS, DCH" },
    { id: 4, img: D4, name: "Dr. Himanshu Gupta", gender: "male", shortDesc: "Bone and joint care", age: 30, specialty: "Orthopedics", experience: "18 years", qualifications: "MBBS, MS" },
    { id: 5, img: D5, name: "Dr. Anushka Yadav", gender: "female", shortDesc: "Skin care specialist", age: 29, specialty: "Dermatology", experience: "4 years", qualifications: "MBBS, DDVL" },
    { id: 6, img: D6, name: "Dr. Anupam Chauhan", gender: "female", shortDesc: "Otolaryngologist ", age: 28, specialty: "Otolaryngologist ", experience: "3 years", qualifications: "MBBS, DM" },
    { id: 7, img: D7, name: "Dr. Arpita Gupta", gender: "male", shortDesc: "Dermatologist ", age: 50, specialty: "Dermatologist ", experience: "25 years", qualifications: "MBBS, MD" },
    { id: 8, img: D8, name: "Dr. Ankit Yadav", gender: "male", shortDesc: "Podiatrist ", age: 42, specialty: "Podiatrist ", experience: "17 years", qualifications: "MBBS, DM" },
    { id: 9, img: D9, name: "Dr. Harsh Gupta", gender: "female", shortDesc: "Kidney care expert", age: 37, specialty: "Nephrologist ", experience: "12 years", qualifications: "MBBS, MS" },
    { id: 10, img: D10, name: "Dr. Sonu Sharma", gender: "male", shortDesc: "Hepatologist", age: 36, specialty: "Hepatologist ", experience: "11 years", qualifications: "MBBS, MS" },
    { id: 11, img: D11, name: "Dr. Siddharth Yadav", gender: "male", shortDesc: "Otolaryngologist ", age: 35, specialty: "Otolaryngologist ", experience: "10 years", qualifications: "MBBS, MD" },
    { id: 12, img: D12, name: "Dr. Arpit Jain", gender: "male", shortDesc: "Orthopedic Surgeon", age: 34, specialty: "Orthopedic Surgeon", experience: "9 years", qualifications: "MBBS, DMRD" },
  ];

  const openPopup = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const closePopup = () => {
    setSelectedDoctor(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-indigo-900 to-purple-900 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center text-amber-200 mb-8 sm:mb-12 animate-fade-in">
          Discover Our Expert Doctors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 animate-fade-in">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-gradient-to-b from-gray-800 to-gray-900 bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-opacity-100"
            >
              <img
                src={doctor.img}
                alt={doctor.name}
                className="w-full h-56 sm:h-64 lg:h-72 object-cover"
              />
              <div className="p-4 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-200">{doctor.name}</h3>
                <p className="text-gray-300 text-sm sm:text-base mt-2">{doctor.shortDesc}</p>
                <button
                  onClick={() => openPopup(doctor)}
                  className="mt-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white px-4 sm:px-6 py-2 rounded-xl hover:from-teal-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-200 transform hover:scale-105"
                >
                  Know More
                </button>
              </div>
            </div>
          ))}
        </div>
        
      </div>

      {/* Popup */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 sm:p-6 z-50 animate-scale-in">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 bg-opacity-95 backdrop-blur-md rounded-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-bold text-amber-200 mb-4">{selectedDoctor.name}</h3>
            <div className="space-y-4 text-gray-200 text-sm sm:text-base">
              <p><span className="font-semibold text-teal-300">Age:</span> {selectedDoctor.age}</p>
              <p><span className="font-semibold text-teal-300">Specialty:</span> {selectedDoctor.specialty}</p>
              <p><span className="font-semibold text-teal-300">Experience:</span> {selectedDoctor.experience}</p>
              <p><span className="font-semibold text-teal-300">Qualifications:</span> {selectedDoctor.qualifications}</p>
            </div>
            <button
              onClick={closePopup}
              className="mt-6 w-full bg-gradient-to-r from-red-600 to-red-500 text-white px-4 sm:px-6 py-2 rounded-xl hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-200 transform hover:scale-105"
            >
              Close
            </button>
          </div>
          
        </div>
        
      )}
      
    </div>
    
  );
};

export default Doctor;