import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  // Optionally render null while redirecting
  if (!token) return null;

  return <>{children}</>;
};

export default UserProtectedWrapper;
