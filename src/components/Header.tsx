'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './auth/AuthProvider';
import { LogIn, LogOut, User, Settings, Menu } from 'lucide-react';
import Link from 'next/link';
import { LoginPopup } from './auth/LoginPopup';
import { RegisterPopup } from './auth/RegisterPopup';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout, login, register } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  const switchToRegister = () => {
    setShowLoginPopup(false);
    setShowRegisterPopup(true);
  };

  const switchToLogin = () => {
    setShowRegisterPopup(false);
    setShowLoginPopup(true);
  };

  return (
    <>
      <header className="mx-width-grid mx-auto flex items-center justify-between px-4 py-3 bg-white shadow-md rounded-lg">
        <div className="flex items-center gap-4">
          <Link href="/">
            <svg width="131" height="24" viewBox="0 0 131 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-mobile-center">
              <path d="M21.9437 2.71503V22.8421H17.9067V9.75084L12.5145 22.8421H9.45798L4.03694 9.75084V22.8421H0V2.71503H4.58481L10.9863 17.6806L17.3877 2.71503H21.9437Z" fill="#9267FD"/>
              <path d="M33.0284 23.1016C31.4905 23.1016 30.1064 22.7652 28.8761 22.0924C27.6458 21.4003 26.675 20.4295 25.9637 19.18C25.2717 17.9305 24.9256 16.4887 24.9256 14.8547C24.9256 13.2207 25.2813 11.7789 25.9925 10.5294C26.723 9.27987 27.7131 8.31869 28.9626 7.64587C30.2121 6.95382 31.6058 6.6078 33.1437 6.6078C34.6816 6.6078 36.0753 6.95382 37.3248 7.64587C38.5744 8.31869 39.5548 9.27987 40.266 10.5294C40.9965 11.7789 41.3618 13.2207 41.3618 14.8547C41.3618 16.4887 40.9869 17.9305 40.2372 19.18C39.5067 20.4295 38.5071 21.4003 37.2383 22.0924C35.9888 22.7652 34.5855 23.1016 33.0284 23.1016ZM33.0284 19.5837C33.7589 19.5837 34.4413 19.4107 35.0757 19.0646C35.7293 18.6994 36.2483 18.1611 36.6328 17.4499C37.0172 16.7386 37.2095 15.8735 37.2095 14.8547C37.2095 13.336 36.8058 12.173 35.9984 11.3656C35.2102 10.539 34.2394 10.1257 33.086 10.1257C31.9326 10.1257 30.9618 10.539 30.1737 11.3656C29.4047 12.173 29.0203 13.336 29.0203 14.8547C29.0203 16.3734 29.3951 17.546 30.1448 18.3726C30.9138 19.18 31.875 19.5837 33.0284 19.5837Z" fill="white"/>
              <path d="M50.4361 23.1016C49.1289 23.1016 47.9563 22.8709 46.9182 22.4095C45.8801 21.929 45.0535 21.285 44.4384 20.4776C43.8424 19.6702 43.5156 18.7763 43.458 17.7959H47.5237C47.6006 18.411 47.8986 18.9205 48.4176 19.3242C48.9559 19.7279 49.6191 19.9297 50.4073 19.9297C51.1762 19.9297 51.7721 19.7759 52.1951 19.4683C52.6372 19.1608 52.8583 18.7667 52.8583 18.2861C52.8583 17.7671 52.5891 17.3826 52.0509 17.1327C51.5318 16.8636 50.6956 16.5752 49.5422 16.2676C48.3503 15.9793 47.3699 15.6813 46.601 15.3737C45.8513 15.0662 45.1977 14.5952 44.6402 13.9608C44.1019 13.3264 43.8328 12.471 43.8328 11.3945C43.8328 10.5102 44.0827 9.70279 44.5825 8.97229C45.1016 8.2418 45.8321 7.66509 46.774 7.24217C47.7352 6.81926 48.8598 6.6078 50.1477 6.6078C52.0509 6.6078 53.5695 7.08839 54.7037 8.04956C55.8379 8.99152 56.4627 10.2699 56.578 11.8847H52.7141C52.6564 11.2503 52.3873 10.7505 51.9067 10.3852C51.4453 10.0008 50.8206 9.80852 50.0324 9.80852C49.3019 9.80852 48.7348 9.94308 48.3311 10.2122C47.9466 10.4813 47.7544 10.8562 47.7544 11.3368C47.7544 11.875 48.0235 12.2884 48.5618 12.5767C49.1001 12.8458 49.9363 13.1246 51.0705 13.4129C52.2239 13.7013 53.1755 13.9992 53.9252 14.3068C54.6749 14.6144 55.3189 15.095 55.8571 15.7486C56.4146 16.383 56.703 17.2288 56.7222 18.2861C56.7222 19.2088 56.4627 20.0354 55.9436 20.7659C55.4438 21.4964 54.7133 22.0731 53.7522 22.4961C52.8102 22.8997 51.7049 23.1016 50.4361 23.1016Z" fill="#9267FD"/>
              <path d="M58.9979 14.797C58.9979 13.1822 59.3151 11.7501 59.9495 10.5006C60.6031 9.25103 61.4778 8.28986 62.5735 7.61703C63.6885 6.94421 64.9284 6.6078 66.2933 6.6078C67.4851 6.6078 68.5232 6.84809 69.4075 7.32868C70.311 7.80927 71.0319 8.41481 71.5701 9.1453V6.86732H75.6359V22.8421H71.5701V20.5064C71.0511 21.2561 70.3302 21.8809 69.4075 22.3807C68.504 22.8613 67.4563 23.1016 66.2644 23.1016C64.9188 23.1016 63.6885 22.7556 62.5735 22.0635C61.4778 21.3715 60.6031 20.4007 59.9495 19.1512C59.3151 17.8824 58.9979 16.431 58.9979 14.797ZM71.5701 14.8547C71.5701 13.8743 71.3779 13.0381 70.9934 12.346C70.6089 11.6348 70.0899 11.0965 69.4363 10.7312C68.7827 10.3468 68.081 10.1545 67.3313 10.1545C66.5816 10.1545 65.8896 10.3372 65.2552 10.7024C64.6208 11.0677 64.1018 11.6059 63.6981 12.3172C63.3136 13.0092 63.1214 13.8358 63.1214 14.797C63.1214 15.7582 63.3136 16.604 63.6981 17.3345C64.1018 18.0458 64.6208 18.5937 65.2552 18.9781C65.9088 19.3626 66.6008 19.5548 67.3313 19.5548C68.081 19.5548 68.7827 19.3722 69.4363 19.007C70.0899 18.6225 70.6089 18.0842 70.9934 17.3922C71.3779 16.6809 71.5701 15.8351 71.5701 14.8547Z" fill="#9267FD"/>
              <path d="M82.4334 20.7083H89.4692V22.8421H79.8094V2.74387H82.4334V20.7083Z" fill="black"/>
              <path d="M93.6111 4.47398C93.1113 4.47398 92.6884 4.30097 92.3424 3.95495C91.9963 3.60893 91.8233 3.18601 91.8233 2.6862C91.8233 2.18638 91.9963 1.76347 92.3424 1.41744C92.6884 1.07142 93.1113 0.898407 93.6111 0.898407C94.0917 0.898407 94.4954 1.07142 94.8222 1.41744C95.1682 1.76347 95.3412 2.18638 95.3412 2.6862C95.3412 3.18601 95.1682 3.60893 94.8222 3.95495C94.4954 4.30097 94.0917 4.47398 93.6111 4.47398ZM94.8799 7.04033V22.8421H92.2559V7.04033H94.8799Z" fill="black"/>
              <path d="M107.051 6.75197C108.973 6.75197 110.531 7.33829 111.722 8.51093C112.914 9.66434 113.51 11.3368 113.51 13.5283V22.8421H110.915V13.9031C110.915 12.3268 110.521 11.1253 109.733 10.2987C108.945 9.45288 107.868 9.02996 106.503 9.02996C105.119 9.02996 104.014 9.46249 103.187 10.3276C102.38 11.1926 101.976 12.4518 101.976 14.105V22.8421H99.352V7.04033H101.976V9.28948C102.495 8.48209 103.197 7.85733 104.081 7.41519C104.985 6.97304 105.975 6.75197 107.051 6.75197Z" fill="black"/>
              <path d="M126.62 22.8421L120.421 15.8639V22.8421H117.796V1.50395H120.421V14.0473L126.505 7.04033H130.167L122.727 14.9124L130.196 22.8421H126.62Z" fill="black"/>
              <path d="M24.9254 15.1909C24.9254 14.8591 25.1944 14.5902 25.5262 14.5902H28.3989C28.7307 14.5902 28.9996 14.8591 28.9996 15.1909V22.46C28.9996 22.7918 28.7307 23.0607 28.3989 23.0607H25.5262C25.1944 23.0607 24.9254 22.7918 24.9254 22.46V15.1909Z" fill="#00C680"/>
              <path d="M24.9254 7.10067C24.9254 6.76889 25.1944 6.49993 25.5262 6.49993H28.3989C28.7307 6.49993 28.9996 6.76889 28.9996 7.10067V13.0076C28.9996 13.3394 28.7307 13.6084 28.3989 13.6084H25.5262C25.1944 13.6084 24.9254 13.3394 24.9254 13.0076V7.10067Z" fill="#FE6BAC"/>
              <path d="M35.8501 6.49993C36.1819 6.49993 36.4508 6.76889 36.4508 7.10067V9.97341C36.4508 10.3052 36.1819 10.5741 35.8501 10.5741H30.5595C30.2277 10.5741 29.9587 10.3052 29.9587 9.97341V7.10067C29.9587 6.76889 30.2277 6.49993 30.5595 6.49993H35.8501Z" fill="#53C5FF"/>
              <path d="M40.8834 18.9865C41.2152 18.9865 41.4841 19.2555 41.4841 19.5873V22.46C41.4841 22.7918 41.2152 23.0607 40.8834 23.0607H30.5595C30.2277 23.0607 29.9587 22.7918 29.9587 22.46V19.5873C29.9587 19.2555 30.2277 18.9865 30.5595 18.9865H40.8834Z" fill="#FFBA59"/>
              <path d="M37.4099 7.10067C37.4099 6.76889 37.6789 6.49993 38.0106 6.49993H40.8834C41.2152 6.49993 41.4841 6.76889 41.4841 7.10067V17.4246C41.4841 17.7564 41.2152 18.0253 40.8834 18.0253H38.0106C37.6789 18.0253 37.4099 17.7564 37.4099 17.4246V7.10067Z" fill="#9267FD"/>
            </svg>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User size={16} className="text-indigo-600" />
                </div>
                <span className="text-sm font-medium hidden md:block">
                  {user?.user_metadata?.full_name || user?.email}
                </span>
              </motion.button>
              
              {/* User dropdown menu */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link href="/accounting" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <Settings size={16} />
                    Accounting
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLoginPopup(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <LogIn size={16} />
              <span className="text-sm font-medium">Sign In</span>
            </motion.button>
          )}
        </div>
      </header>

      {/* Login Popup */}
      <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onLogin={async (email, password) => {
          try {
            await login(email, password);
            setShowLoginPopup(false);
          } catch (error) {
            // Error is handled by the component
          }
        }}
        onRegister={switchToRegister}
        error={null}
      />

      {/* Register Popup */}
      <RegisterPopup
        isOpen={showRegisterPopup}
        onClose={() => setShowRegisterPopup(false)}
        onRegister={async (name, email, password) => {
          try {
            await register(name, email, password);
            setShowRegisterPopup(false);
          } catch (error) {
            // Error is handled by the component
          }
        }}
        onLogin={switchToLogin}
        error={null}
      />
    </>
  );
};