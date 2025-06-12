import { Navigate } from 'react-router-dom';
import { getToken, getUserRole } from '../utils/auth';

const AuthRoute = ({ children, roles }) => {
  const token = getToken();
  const userRole = getUserRole();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/403" replace />;
  }
  
  return children;
};