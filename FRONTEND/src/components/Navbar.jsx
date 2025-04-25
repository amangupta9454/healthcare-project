import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl sm:text-2xl font-extrabold tracking-tight hover:text-amber-400 transition-colors duration-300"
        >
          AMAN HEALTHCARE
        </Link>
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-2xl sm:text-3xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-md p-1.5"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
        <ul className="hidden lg:flex gap-6 xl:gap-8 text-base xl:text-lg items-center font-medium">
          <li>
            <Link
              to="/"
              className="relative px-2 py-1 hover:text-amber-400 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full"
            >
              HOME
            </Link>
          </li>
          <li>
            <Link
              to="/doctor"
              className="relative px-2 py-1 hover:text-amber-400 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full"
            >
              DOCTOR
            </Link>
          </li>
          <li>
            <Link
              to="/appointment"
              className="relative px-2 py-1 hover:text-amber-400 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full"
            >
              APPOINTMENT
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="relative px-2 py-1 hover:text-amber-400 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full"
            >
              CONTACT
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link
                  to={
                    user.role === 'patient'
                      ? '/patient-dashboard'
                      : user.role === 'doctor'
                      ? '/doctor-dashboard'
                      : '/admin/dashboard'
                  }
                  className="relative px-2 py-1 hover:text-amber-400 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {user.role === 'admin' ? 'ADMIN DASHBOARD' : 'DASHBOARD'}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-400 transition-colors duration-200 font-semibold text-base shadow-sm"
                >
                  LOGOUT
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="px-4 py-1.5 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-400 transition-colors duration-200 font-semibold text-base shadow-sm"
                >
                  LOGIN
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/login"
                  className="px-4 py-1.5 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-400 transition-colors duration-200 font-semibold text-base shadow-sm"
                >
                  ADMIN LOGIN
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      {menuOpen && (
        <div className="lg:hidden bg-gray-800 px-4 py-6 transition-all duration-300 ease-in-out transform origin-top">
          <ul className="flex flex-col gap-3 text-base sm:text-lg font-medium">
            <li>
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-3 hover:text-amber-400 transition-colors duration-200 hover:bg-gray-700 rounded-md"
              >
                HOME
              </Link>
            </li>
            <li>
              <Link
                to="/doctor"
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-3 hover:text-amber-400 transition-colors duration-200 hover:bg-gray-700 rounded-md"
              >
                DOCTOR
              </Link>
            </li>
            <li>
              <Link
                to="/appointment"
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-3 hover:text-amber-400 transition-colors duration-200 hover:bg-gray-700 rounded-md"
              >
                APPOINTMENT
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-3 hover:text-amber-400 transition-colors duration-200 hover:bg-gray-700 rounded-md"
              >
                CONTACT
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link
                    to={
                      user.role === 'patient'
                        ? '/patient-dashboard'
                        : user.role === 'doctor'
                        ? '/doctor-dashboard'
                        : '/admin/dashboard'
                    }
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 px-3 hover:text-amber-400 transition-colors duration-200 hover:bg-gray-700 rounded-md"
                  >
                    {user.role === 'admin' ? 'ADMIN DASHBOARD' : 'DASHBOARD'}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 px-4 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-400 transition-colors duration-200 font-semibold shadow-sm"
                  >
                    LOGOUT
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 px-4 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-400 transition-colors duration-200 font-semibold shadow-sm"
                  >
                    LOGIN
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/login"
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 px-4 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-400 transition-colors duration-200 font-semibold shadow-sm"
                  >
                    ADMIN LOGIN
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;