import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage(props) {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.user?.id) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  }, []);

  return <div></div>;
}
