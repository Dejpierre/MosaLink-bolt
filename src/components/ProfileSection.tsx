import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { MapPin, Globe, Edit3, Camera, Building } from 'lucide-react';

export const ProfileSection: React.FC = () => {
  const { profile } = useStore();
  const isCompany = profile.type === 'company';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="mx-width-grid relative rounded-lg 0 overflow-hidden m-auto"
    >
      

      <div className="relative z-10">
        {isCompany ? (
          /* Company Profile */
          <div className="flex items-center justify-center p-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative group flex-shrink-0"
            >
              <div className="relative flex items-center justify-center">
                {profile.companyLogo ? (
                  <motion.img
                    src={profile.companyLogo}
                    alt={profile.companyName}
                    className="h-16 object-contain"
                    whileHover={{ rotate: 2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                    <Building size={32} className="text-gray-400" />
                  </div>
                )}
                
                {/* Hover Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer rounded-full"
                >
                  <Camera size={16} className="text-white" />
                </motion.div>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl scale-110" />
            </motion.div>
          </div>
        ) : (
          /* Personal Profile */
          <div className="flex items-center p-2 gap-4 rounded-full bg-white w_fit">
            {/* Profile Image - Plus petit */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative group flex-shrink-0"
            >
              <div className="relative">
                <motion.img
                  src={profile.profileImage}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/20 shadow-lg"
                  whileHover={{ rotate: 2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                
                {/* Hover Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                >
                  <Camera size={16} className="text-white" />
                </motion.div>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl scale-110" />
              </div>
            </motion.div>

            {/* Profile Info - Compact */}
            <div className=" min-w-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text mb-1">
                  {profile.firstName} {profile.lastName}
                </h1>
                
                {/* Additional Info - Compact <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-400 text-sm leading-relaxed mb-2 line-clamp-2"
                >
                  {profile.bio}
                </motion.p> */}

                {/* Additional Info - Compact */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 text-xs text-gray-500"
                >
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-indigo-400" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  
                  {profile.website && (
                    <div className="flex items-center gap-1">
                      <Globe size={12} className="text-purple-400" />
                      <a 
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors duration-200 hover:underline truncate max-w-32"
                      >
                        {profile.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </div>

            {/* Edit Button - Plus petit */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-300 text-xs font-medium flex-shrink-0"
            >
              <Edit3 size={12} />
              Edit
            </motion.button>
          </div>
        )}
      </div>

      
    </motion.div>
  );
};