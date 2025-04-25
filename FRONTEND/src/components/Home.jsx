import { useEffect, useRef, useState } from 'react';
import Typed from 'typed.js';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaGithub, FaWhatsapp, FaLinkedin, FaInstagram, FaArrowUp } from 'react-icons/fa';
import D1 from "../assets/D1.jpg";
import D2 from "../assets/D2.jpg";
import D3 from "../assets/D3.jpg";
import D4 from "../assets/D4.jpg";
import D5 from "../assets/D5.jpg";
import D6 from "../assets/D6.jpg";
import teeth from "../assets/teeth.jpg";
import palm from "../assets/palm.jpg";
import nose from "../assets/nose.jpg";
import liver from "../assets/liver.jpg";
import knee from "../assets/knee.jpg";
import kidney from "../assets/kidney.jpg";
import foot from "../assets/foot.jpg";
import face from "../assets/face.jpg";
import ear from "../assets/Ear.jpg";
import aman from "../assets/aman.png";
import anshu from "../assets/anshu.jpeg";
import himanshu from "../assets/himanshu.jpeg";
import { Link } from 'react-router-dom';

const Home = () => {
  const typedRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: ['Welcome to My Healthcare', 'We Care for You'],
      typeSpeed: 50,
      backSpeed: 30,
      loop: true,
    });
    return () => typed.destroy();
  }, []);

  const sliderSettings = {
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const specialties = [
    { img: teeth, title: 'Oral Surgeon' },
    { img: palm, title: 'Orthopedic Surgeon' },
    { img: nose, title: 'Otolaryngologist' },
    { img: liver, title: 'Hepatologist' },
    { img: knee, title: 'Orthopedic Surgeon' },
    { img: kidney, title: 'Nephrologist' },
    { img: foot, title: 'Podiatrist' },
    { img: face, title: 'Plastic Surgeon' },
    { img: ear, title: 'Otolaryngologist' },
  ];

  const features = [
    { img: D1, title: 'Emergency Care', desc: '24/7 emergency services.' },
    { img: D2, title: 'Expert Doctors', desc: 'Skilled medical professionals.' },
    { img: D3, title: 'Modern Equipment', desc: 'Advanced medical technology.' },
    { img: D4, title: 'Patient Support', desc: 'Personalized care for all.' },
    { img: D5, title: 'Online Booking', desc: 'Book appointments easily.' },
    { img: D6, title: 'Health Plans', desc: 'Affordable health packages.' },
  ];

  const teamMembers = [
    {
      name: "Aman Gupta",
      image: aman,
      linkedin: "https://www.linkedin.com/in/amangupta9454/",
      courseYear: "2nd Year, B.Tech",
      role: "Mern Stack Developer",
    },
    {
      name: "Anshu",
      image: anshu,
      linkedin: "https://www.linkedin.com/in/anshu-kumari-302643328/",
      courseYear: "2nd Year, B.Tech",
      role: "Frontend Developer",
    },
    {
      name: "Himanshu Gupta",
      image: himanshu,
      linkedin: "https://www.linkedin.com/in/himanshu561hi/",
      courseYear: "2nd Year, B.Tech",
      role: "Backend Developer",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-900 via-navy-900 to-emerald-900 text-white py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-6 sm:gap-10 lg:gap-12 animate-fade-in">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-gold-200 leading-tight">
              <span ref={typedRef}></span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-teal-300">Compassionate care for your well-being</p>
          </div>
          <div className="md:w-1/2">
            <img
              src={D1}
              alt="Healthcare"
              className="w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 max-w-full mx-auto rounded-full object-cover shadow-xl border-4 border-teal-500 transition-all duration-300 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-teal-900 via-navy-900 to-emerald-900 border-t-2 border-cyan-400">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center mb-8 sm:mb-12 text-gold-200 transition-all duration-300 hover:text-orange-400">
            Our Specialties
          </h2>
          <Slider {...sliderSettings}>
            {specialties.map((spec, index) => (
              <div key={index} className="px-2 sm:px-3">
                <div className="bg-gradient-to-b from-gray-800 to-gray-900 bg-opacity-90 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
                  <img
                    src={spec.img}
                    alt={spec.title}
                    className="w-full h-64 sm:h-48 md:h-64 object-cover rounded-t-2xl"
                  />
                  <p className="p-4 sm:p-5 text-center font-semibold text-teal-200 text-sm sm:text-base md:text-lg">{spec.title}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-teal-900 via-navy-900 to-emerald-900 border-t-2 border-cyan-400">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center mb-8 sm:mb-12 text-gold-200 transition-all duration-300 hover:text-orange-400">
            Our Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-gray-800 to-gray-900 bg-opacity-90 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                <img
                  src={feature.img}
                  alt={feature.title}
                  className="w-full h-64 sm:h-48 md:h-64 object-cover rounded-t-2xl"
                />
                <div className="p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-teal-200">{feature.title}</h3>
                  <p className="text-gray-300 text-sm sm:text-base mt-2">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gradient-to-br from-teal-900 via-gray-900 to-emerald-900 text-white py-12 sm:py-16 border-t-2 border-cyan-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-16">
          <div className="lg:col-span-1">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-5 text-amber-300 transition-all duration-300 hover:text-amber-400">
              AMAN HEALTHCARE
            </h3>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
              NTPC Colony, Mishalgarhi, Ghaziabad
            </p>
          </div>
          <div className="lg:col-span-1">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-5 text-amber-300 transition-all duration-300 hover:text-amber-400">
              Quick Links
            </h3>
            <ul className="space-y-4 text-gray-300 text-sm sm:text-base lg:text-lg">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition-all duration-200 transform hover:translate-x-2">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/doctor" className="hover:text-cyan-400 transition-all duration-200 transform hover:translate-x-2">
                  Doctors
                </Link>
              </li>
              <li>
                <Link to="/appointment" className="hover:text-cyan-400 transition-all duration-200 transform hover:translate-x-2">
                  Appointment
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition-all duration-200 transform hover:translate-x-2">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-cyan-400 transition-all duration-200 transform hover:translate-x-2">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-1">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-5 text-amber-300 transition-all duration-300 hover:text-amber-400">
              Follow Us
            </h3>
            <div className="flex flex-wrap gap-5 sm:gap-6">
              <a
                href="https://wa.me/9560472926"
                className="text-gray-300 hover:text-green-400 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={28} />
              </a>
              <a
                href="https://www.linkedin.com/in/amangupta9454/"
                className="text-gray-300 hover:text-blue-400 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={28} />
              </a>
              <a
                href="https://github.com/amangupta9454"
                className="text-gray-300 hover:text-gray-400 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-label="GitHub"
              >
                <FaGithub size={28} />
              </a>
              <a
                href="https://www.instagram.com/gupta_aman_9161/"
                className="text-gray-300 hover:text-pink-400 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-400"
                aria-label="Instagram"
              >
                <FaInstagram size={28} />
              </a>
            </div>
          </div>
          <div className="lg:col-span-1">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-5 text-amber-300 transition-all duration-300 hover:text-amber-400">
              Contact
            </h3>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
              Email: <a href="mailto:ag0567688@gmail.com" className="hover:text-cyan-400 transition-all duration-200">ag0567688@gmail.com</a>
            </p>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed mt-2">
              Phone: <a href="tel:+919560472926" className="hover:text-cyan-400 transition-all duration-200">+91 9560472926</a>
            </p>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <button
            onClick={scrollToTop}
            className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white p-3.5 sm:p-4 rounded-full hover:from-cyan-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 transform hover:scale-105 shadow-md"
            aria-label="Scroll to top"
          >
            <FaArrowUp size={22} />
          </button>
        </div>

        <div className="mt-10 sm:mt-12 text-center text-gray-300 text-sm sm:text-base">
          <p className="font-mono tracking-wide">
            © {new Date().getFullYear()} Aman Gupta
          </p>
          <button
            onClick={() => setShowPopup(true)}
            className="mt-3 text-cyan-300 hover:text-cyan-400 text-sm sm:text-base font-semibold transition-all duration-200 underline underline-offset-4"
          >
            Created by Code Veda
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 sm:p-6 z-50 transition-all duration-300">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 sm:p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-center text-amber-300 mb-6">Code Veda Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-xl p-4 sm:p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-102"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full object-cover border-2 border-cyan-500 mb-4"
                  />
                  <h4 className="text-lg sm:text-xl font-semibold text-cyan-200 text-center">{member.name}</h4>
                  <p className="text-gray-300 text-sm sm:text-base text-center mt-2">
                    <span className="font-semibold text-cyan-300">Course:</span> {member.courseYear}
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base text-center mt-2">
                    <span className="font-semibold text-cyan-300">Role:</span> {member.role}
                  </p>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block text-center text-cyan-300 hover:text-cyan-400 text-sm sm:text-base font-semibold transition-all duration-200"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-6 w-full bg-gradient-to-r from-red-600 to-red-500 text-white px-4 sm:px-6 py-2.5 rounded-xl hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-200 transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>

    </div>
  );
};

export default Home;