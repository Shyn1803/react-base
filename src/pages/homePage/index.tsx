import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/redux/store';

export default function HomePage() {
  const userStore: any = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (userStore?.user?.id) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  }, []);

  return <div></div>;
}
