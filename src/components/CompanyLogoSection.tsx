import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Building, Edit3 } from 'lucide-react';

export const CompanyLogoSection: React.FC = () => {
  const { profile } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="mx-width-grid relative rounded-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 overflow-hidden m-auto flex items-center justify-center p-4"
    >
      <div className="relative z-10 flex flex-col items-center">
        {/* Company Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative group flex-shrink-0"
        >
          <div className="relative flex items-center justify-center">
            {profile.companyLogo ? (
              <motion.img
                src={profile.companyLogo}
                alt={profile.companyName}
                className="h-20 object-contain"
                whileHover={{ rotate: 2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                <Building size={40} className="text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl scale-110" />
        </motion.div>
        
        {/* Edit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-2 flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-300 text-xs font-medium"
        >
          <Edit3 size={12} />
          Edit
        </motion.button>
      </div>
    </motion.div>
  );
};