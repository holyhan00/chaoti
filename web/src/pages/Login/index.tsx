// src/pages/Login/index.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { LoginForm } from './LoginForm';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) navigate('/workspace');
  }, [isAuthenticated]);

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <LoginForm onLogin={(type, phone, code) => {
        if (type === 'user' && phone && code) login(phone, code);
      }} />
    </div>
  );
};