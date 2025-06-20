import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useStore } from '../store/useStore';
import { ProfileData, ProfilePlacement, ProfileType } from '../types';
import { Save, User, MapPin, Globe, FileText, Camera, X, Settings, Crown, Building } from 'lucide-react';

interface ProfileEditorProps {
  onClose: () => void;
}

interface FormData extends Omit<ProfileData, 'type'> {
  type: ProfileType;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ onClose }) => {
  const { profile, updateProfile, profilePlacement, updateProfilePlacement, createProfileCard, removeProfileCard, getProfileCard, userPlan } = useStore();
  const [imagePreview, setImagePreview] = useState(profile.profileImage);
  const [logoPreview, setLogoPreview] = useState(profile.companyLogo || '');
  const [showPlacementSettings, setShowPlacementSettings] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<ProfilePlacement['mode']>(profilePlacement.mode);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [isRemovingCard, setIsRemovingCard] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileType, setProfileType] = useState<ProfileType>(profile.type || 'personal');

  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      ...profile,
      type: profile.type || 'personal'
    }
  });

  const onSubmit = (data: FormData) => {
    const updatedProfile: ProfileData = {
      ...data,
      type: profileType,
      profileImage: profileType === 'personal' ? imagePreview : profile.profileImage,
      companyLogo: profileType === 'company' ? logoPreview : profile.companyLogo
    };
    
    updateProfile(updatedProfile);
    
    // Si le placement a changé, mettre à jour
    if (selectedPlacement !== profilePlacement.mode) {
      handlePlacementChange(selectedPlacement);
    }
    
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setImagePreview(url);
  };

  const handleLogoUrlChange = (url: string) => {
    setLogoPreview(url);
  };

  const handlePlacementChange = async (mode: ProfilePlacement['mode']) => {
    setError(null);
    
    if (mode === 'bento') {
      // Vérifier si le plan permet la carte profil
      if (userPlan === 'free') {
        setError('Les cartes profil nécessitent un plan payant');
        return;
      }
      
      // Si on passe en mode bento, créer une carte profil
      const profileCard = getProfileCard();
      if (!profileCard) {
        setIsCreatingCard(true);
        const result = await createProfileCard();
        setIsCreatingCard(false);
        
        if (result.success) {
          updateProfilePlacement({
            mode: 'bento',
            cardId: result.cardId
          });
          setSelectedPlacement('bento');
        } else {
          setError(result.error || 'Erreur lors de la création de la carte profil');
        }
      } else {
        // La carte existe déjà
        updateProfilePlacement({
          mode: 'bento',
          cardId: profileCard.id
        });
        setSelectedPlacement('bento');
      }
    } else {
      // Si on passe en mode header, supprimer la carte profil si elle existe
      const profileCard = getProfileCard();
      if (profileCard) {
        setIsRemovingCard(true);
        removeProfileCard();
        setIsRemovingCard(false);
      }
      
      updateProfilePlacement({
        mode: 'header',
        headerStyle: 'compact'
      });
      setSelectedPlacement('header');
    }
  };

  const handleProfileTypeChange = (type: ProfileType) => {
    setProfileType(type);
  };

  // Suggestions d'images de profil par défaut
  const defaultImages = [
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];

  // Suggestions de logos d'entreprise par défaut
  const defaultLogos = [
    'https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/5668857/pexels-photo-5668857.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/5668855/pexels-photo-5668855.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/5668854/pexels-photo-5668854.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/5668853/pexels-photo-5668853.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Edit Profile
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </motion.button>
        </div>

        {/* Profile Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-white">Profile Type</label>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleProfileTypeChange('personal')}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                profileType === 'personal'
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${
                  profileType === 'personal' ? 'bg-indigo-500/20' : 'bg-white/10'
                }`}>
                  <User size={18} className={profileType === 'personal' ? 'text-indigo-400' : 'text-gray-400'} />
                </div>
                <div>
                  <h4 className="font-medium text-white">Personal</h4>
                  <p className="text-xs text-gray-400">Individual profile with personal details</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleProfileTypeChange('company')}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                profileType === 'company'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${
                  profileType === 'company' ? 'bg-blue-500/20' : 'bg-white/10'
                }`}>
                  <Building size={18} className={profileType === 'company' ? 'text-blue-400' : 'text-gray-400'} />
                </div>
                <div>
                  <h4 className="font-medium text-white">Company</h4>
                  <p className="text-xs text-gray-400">Business profile with company logo</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Profile Fields */}
          {profileType === 'personal' && (
            <>
              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium mb-3 text-white">Profile Image</label>
                
                {/* Current Image Preview */}
                <div className="flex items-center gap-4 mb-4">
                  <motion.img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-20 h-20 rounded-xl object-cover border-2 border-white/20"
                    whileHover={{ scale: 1.05 }}
                  />
                  <div className="flex-1">
                    <input
                      type="url"
                      placeholder="Enter image URL"
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors text-white"
                      value={imagePreview}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Or choose from suggestions below
                    </p>
                  </div>
                </div>

                {/* Image Suggestions */}
                <div className="grid grid-cols-6 gap-2">
                  {defaultImages.map((img, index) => (
                    <motion.button
                      key={index}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleImageUrlChange(img)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        imagePreview === img 
                          ? 'border-indigo-400 ring-2 ring-indigo-400/50' 
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Option ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    <User size={16} className="inline mr-2" />
                    First Name
                  </label>
                  <input
                    {...register('firstName', { required: profileType === 'personal' })}
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors text-white"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Last Name</label>
                  <input
                    {...register('lastName', { required: profileType === 'personal' })}
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors text-white"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  <FileText size={16} className="inline mr-2" />
                  Bio
                </label>
                <textarea
                  {...register('bio')}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors resize-none text-white"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Optional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    <MapPin size={16} className="inline mr-2" />
                    Location (Optional)
                  </label>
                  <input
                    {...register('location')}
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors text-white"
                    placeholder="New York, NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    <Globe size={16} className="inline mr-2" />
                    Website (Optional)
                  </label>
                  <input
                    {...register('website')}
                    type="url"
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors text-white"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </>
          )}

          {/* Company Profile Fields */}
          {profileType === 'company' && (
            <>
              {/* Company Logo */}
              <div>
                <label className="block text-sm font-medium mb-3 text-white">Company Logo</label>
                
                {/* Current Logo Preview */}
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="w-20 h-20 rounded-xl flex items-center justify-center bg-white/10 border-2 border-white/20 overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Company logo"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building size={32} className="text-gray-400" />
                    )}
                  </motion.div>
                  <div className="flex-1">
                    <input
                      type="url"
                      placeholder="Enter logo URL"
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors text-white"
                      value={logoPreview}
                      onChange={(e) => handleLogoUrlChange(e.target.value)}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Or choose from suggestions below
                    </p>
                  </div>
                </div>

                {/* Logo Suggestions */}
                <div className="grid grid-cols-6 gap-2">
                  {defaultLogos.map((img, index) => (
                    <motion.button
                      key={index}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLogoUrlChange(img)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        logoPreview === img 
                          ? 'border-blue-400 ring-2 ring-blue-400/50' 
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Logo option ${index + 1}`}
                        className="w-full h-full object-contain bg-white/10"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  <Building size={16} className="inline mr-2" />
                  Company Name
                </label>
                <input
                  {...register('companyName', { required: profileType === 'company' })}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors text-white"
                  placeholder="Acme Inc."
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  <FileText size={16} className="inline mr-2" />
                  Company Description
                </label>
                <textarea
                  {...register('bio')}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors resize-none text-white"
                  rows={4}
                  placeholder="Tell us about your company..."
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  <Globe size={16} className="inline mr-2" />
                  Company Website
                </label>
                <input
                  {...register('website')}
                  type="url"
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors text-white"
                  placeholder="https://company.com"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  <MapPin size={16} className="inline mr-2" />
                  Location (Optional)
                </label>
                <input
                  {...register('location')}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors text-white"
                  placeholder="New York, NY"
                />
              </div>
            </>
          )}

          {/* Profile Placement Settings */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Settings size={18} className="text-indigo-400" />
                Placement du Profil
              </h3>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPlacementSettings(!showPlacementSettings)}
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                {showPlacementSettings ? 'Masquer' : 'Configurer'}
              </motion.button>
            </div>

            {showPlacementSettings && (
              <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mode Header */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPlacement('header')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPlacement === 'header'
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${
                        selectedPlacement === 'header' ? 'bg-indigo-500/20' : 'bg-white/10'
                      }`}>
                        <User size={18} className={selectedPlacement === 'header' ? 'text-indigo-400' : 'text-gray-400'} />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">En-tête</h4>
                        <p className="text-xs text-gray-400">Profil affiché en haut</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Mode Bento */}
                  <motion.div
                    whileHover={{ scale: userPlan !== 'free' ? 1.02 : 1 }}
                    whileTap={{ scale: userPlan !== 'free' ? 0.98 : 1 }}
                    onClick={() => userPlan !== 'free' && setSelectedPlacement('bento')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      userPlan === 'free'
                        ? 'border-gray-600 bg-gray-800/50 cursor-not-allowed opacity-60'
                        : selectedPlacement === 'bento'
                        ? 'border-orange-500 bg-orange-500/10 cursor-pointer'
                        : 'border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${
                        selectedPlacement === 'bento' 
                          ? 'bg-orange-500/20' 
                          : userPlan !== 'free'
                          ? 'bg-white/10'
                          : 'bg-gray-700/50'
                      }`}>
                        <Settings size={18} className={
                          selectedPlacement === 'bento' 
                            ? 'text-orange-400' 
                            : userPlan !== 'free'
                            ? 'text-gray-400'
                            : 'text-gray-600'
                        } />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white">Bloc Bento</h4>
                          {userPlan === 'free' && <Crown size={14} className="text-yellow-400" />}
                        </div>
                        <p className="text-xs text-gray-400">Profil intégré dans la grille</p>
                      </div>
                    </div>
                    
                    {userPlan === 'free' && (
                      <div className="mt-2 text-xs text-yellow-400">
                        Nécessite un plan payant
                      </div>
                    )}
                  </motion.div>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                    <X size={16} />
                    {error}
                  </div>
                )}

                {isCreatingCard && (
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 text-sm flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    Création de la carte profil...
                  </div>
                )}

                {isRemovingCard && (
                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400 text-sm flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                    Suppression de la carte profil...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 p-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all font-medium text-white"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 font-medium transition-all text-white"
            >
              <Save size={18} />
              Save Profile
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};