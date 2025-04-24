
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import { Toaster } from '@/components/ui/sonner';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Toaster />
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-full bg-gym-purple flex items-center justify-center mb-4">
            <span className="text-white font-bold text-lg">GS</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">GymSpark Lite</h1>
          <p className="text-gray-500 mt-1">Gym Management System</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
