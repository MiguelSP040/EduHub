import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
