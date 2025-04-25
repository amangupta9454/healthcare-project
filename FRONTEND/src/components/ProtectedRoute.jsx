import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);
  if (!user || user.role !== role) {
    return   <Navigate to="/login"></Navigate>;
  }

  return children;
};


export default ProtectedRoute