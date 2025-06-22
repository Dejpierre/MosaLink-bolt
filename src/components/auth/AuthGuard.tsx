import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { LoginPopup } from './LoginPopup';
import { RegisterPopup } from './RegisterPopup';
import { motion } from 'framer-motion';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, login, register, error } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Wait for initial auth check to complete
  useEffect(() => {
    if (!isLoading) {
      setInitialCheckDone(true);
      
      // If not authenticated after initial load, show login popup
      if (!isAuthenticated) {
        setShowLoginPopup(true);
      }
    }
  }, [isLoading, isAuthenticated]);

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    setShowLoginPopup(false);
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    await register(name, email, password);
    setShowRegisterPopup(false);
  };

  const switchToRegister = () => {
    setShowLoginPopup(false);
    setShowRegisterPopup(true);
  };

  const switchToLogin = () => {
    setShowRegisterPopup(false);
    setShowLoginPopup(true);
  };

  // Show loading state
  if (!initialCheckDone) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <>
      {children}
      
      <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onLogin={handleLogin}
        onRegister={switchToRegister}
        error={error}
      />
      
      <RegisterPopup
        isOpen={showRegisterPopup}
        onClose={() => setShowRegisterPopup(false)}
        onRegister={handleRegister}
        onLogin={switchToLogin}
        error={error}
      />
    </>
  );
};