import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserLogout = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          localStorage.removeItem('token');
          navigate('/');
        }
      } catch (error) {
        console.error('Logout error:', error);
        navigate('/');
      }
    };

    logout();
  }, [navigate, token]);

  return <div>Logging out...</div>;
};

export default UserLogout;
