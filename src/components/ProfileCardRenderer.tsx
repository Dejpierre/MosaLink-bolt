import React from 'react';
import { motion } from 'framer-motion';
import { BentoCard, ProfileData } from '../types';
import { MapPin, Globe, User, Mail, Phone, Calendar, Star, Briefcase, Building2 } from 'lucide-react';

interface ProfileCardRendererProps {
  card: BentoCard;
  profile: ProfileData;
  isLarge: boolean;
  titleStyles: any;
  descriptionStyles: any;
  getTitleSizeClass: () => string;
  getDescriptionSizeClass: () => string;
}

export const ProfileCardRenderer: React.FC<ProfileCardRendererProps> = ({
  card,
  profile,
  isLarge,
  titleStyles,
  descriptionStyles,
  getTitleSizeClass,
  getDescriptionSizeClass
}) => {
  const isCompany = profile.type === 'company';
  
  // Get the text color based on subscription and profile type
  const getTextColor = () => {
    if (isCompany && profile.companySecondaryColor) {
      return profile.companySecondaryColor;
    }
    return card.textColor;
  };

  return (
    <div className="relative z-10 h-full flex flex-col p-6 lg:p-8">
      {/* Profile Header */}
      <div className={`flex items-center gap-4 mb-4 ${isLarge ? 'mb-6' : ''}`}>
        {/* Profile Image */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative flex-shrink-0"
        >
          {/* Logo d'entreprise si applicable */}
          {isCompany && profile.companyLogo && (
            <div className="absolute -top-2 -left-2 z-10">
              <img
                src={profile.companyLogo}
                alt={profile.companyName || "Company"}
                className="w-8 h-8 rounded-full object-cover border-2 border-white/30 shadow-lg"
              />
            </div>
          )}

          <img
            src={profile.profileImage}
            alt={isCompany ? profile.companyName || "Company" : `${profile.firstName} ${profile.lastName}`}
            className={`rounded-xl object-cover border-2 border-white/30 shadow-lg ${
              isLarge ? 'w-20 h-20 lg:w-24 lg:h-24' : 'w-16 h-16'
            }`}
          />
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl scale-110" />
        </motion.div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <motion.h3 
            className={`
              leading-tight mb-1 font-bold
              ${getTitleSizeClass()}
            `}
            style={{ 
              color: getTextColor(),
              ...titleStyles
            }}
          >
            {isCompany 
              ? profile.companyName || `${profile.firstName} ${profile.lastName}`
              : `${profile.firstName} ${profile.lastName}`
            }
          </motion.h3>
          
          {/* Position pour les profils entreprise */}
          {isCompany && profile.position && (
            <motion.div 
              className="flex items-center gap-2 mb-2"
              style={{ color: getTextColor() }}
            >
              <Briefcase size={14} className="opacity-80" />
              <span className="text-sm font-medium opacity-90">{profile.position}</span>
            </motion.div>
          )}
          
          {/* Bio */}
          <motion.p 
            className={`
              opacity-90 leading-relaxed line-clamp-2
              ${getDescriptionSizeClass()}
              ${isLarge ? 'max-w-md line-clamp-3' : ''}
            `}
            style={{ 
              color: getTextColor(),
              ...descriptionStyles
            }}
          >
            {profile.bio}
          </motion.p>
        </div>
      </div>

      {/* Profile Details - Only for large cards */}
      {isLarge && (
        <div className="flex-1 space-y-3">
          {/* Location */}
          {profile.location && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                <MapPin size={16} className="text-white/80" />
              </div>
              <span className="text-white/90 text-sm font-medium">
                {profile.location}
              </span>
            </motion.div>
          )}

          {/* Website */}
          {profile.website && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                <Globe size={16} className="text-white/80" />
              </div>
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 text-sm font-medium hover:text-white transition-colors truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            </motion.div>
          )}

          {/* Stats ou informations supplémentaires */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-6 pt-2"
          >
            <div className="flex items-center gap-2">
              <Star size={14} className="text-yellow-400" />
              <span className="text-white/80 text-xs">
                {isCompany ? 'Entreprise Vérifiée' : 'Profil Vérifié'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-blue-400" />
              <span className="text-white/80 text-xs">Membre depuis 2024</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Action Button */}
      {card.url && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            if (card.url) {
              window.open(card.url, '_blank', 'noopener,noreferrer');
            }
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 400, 
            damping: 25 
          }}
          className={`
            inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm 
            border border-white/30 rounded-full font-medium self-start 
            hover:bg-white/30 transition-all duration-300 mt-4
            ${isLarge ? 'px-6 py-3 text-sm' : 'px-4 py-2 text-xs'}
          `}
          style={{ 
            color: getTextColor(),
            fontFamily: titleStyles.fontFamily,
            fontWeight: descriptionStyles.fontWeight
          }}
        >
          {isCompany ? <Building2 size={isLarge ? 16 : 14} /> : <User size={isLarge ? 16 : 14} />}
          {isLarge 
            ? (isCompany ? 'Voir l\'entreprise' : 'Voir le profil') 
            : (isCompany ? 'Entreprise' : 'Profil')
          }
        </motion.button>
      )}

      {/* Decorative elements for profile cards */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-orange-400 rounded-full opacity-60" />
      <div className="absolute top-6 right-6 w-1 h-1 bg-yellow-400 rounded-full opacity-40" />
      <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-30" />
    </div>
  );
};