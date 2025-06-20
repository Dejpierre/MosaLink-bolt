import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { 
  User, 
  Building, 
  Palette, 
  Image as ImageIcon, 
  Save, 
  X, 
  Upload, 
  Check, 
  AlertCircle,
  RefreshCw,
  Link,
  Settings,
  CreditCard,
  LogOut,
  Lock,
  Bell,
  Shield,
  HelpCircle
} from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { useSubscription } from '../../hooks/useSubscription';
import { PlanBadge } from '../subscription/PlanBadge';

export const AccountPage: React.FC = () => {
  const { profile, updateProfile, userPlan } = useStore();
  const { currentPlan, subscription } = useSubscription();
  
  // Company settings
  const [companyLogo, setCompanyLogo] = useState<string>(profile.companyLogo || 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=400');
  const [companyName, setCompanyName] = useState<string>(profile.companyName || 'My Company');
  const [primaryColor, setPrimaryColor] = useState<string>(profile.companyPrimaryColor || '#6366f1');
  const [secondaryColor, setSecondaryColor] = useState<string>(profile.companySecondaryColor || '#8b5cf6');
  const [showPrimaryColorPicker, setShowPrimaryColorPicker] = useState<boolean>(false);
  const [showSecondaryColorPicker, setShowSecondaryColorPicker] = useState<boolean>(false);
  
  // Account settings
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'billing' | 'security' | 'notifications'>('company');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // File upload
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Load profile data when component mounts
  useEffect(() => {
    setCompanyLogo(profile.companyLogo || 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=400');
    setCompanyName(profile.companyName || 'My Company');
    setPrimaryColor(profile.companyPrimaryColor || '#6366f1');
    setSecondaryColor(profile.companySecondaryColor || '#8b5cf6');
  }, [profile]);
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCompanyLogo(result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleSaveCompanySettings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update profile with company settings
      await updateProfile({
        ...profile,
        companyName,
        companyLogo,
        companyPrimaryColor: primaryColor,
        companySecondaryColor: secondaryColor,
        type: 'company' // Ensure profile type is set to company
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save company settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sample logo suggestions
  const logoSuggestions = [
    'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2292953/pexels-photo-2292953.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1462935/pexels-photo-1462935.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];
  
  // Color presets
  const colorPresets = [
    { primary: '#6366f1', secondary: '#8b5cf6' }, // Indigo + Purple
    { primary: '#3b82f6', secondary: '#06b6d4' }, // Blue + Cyan
    { primary: '#10b981', secondary: '#84cc16' }, // Emerald + Lime
    { primary: '#f97316', secondary: '#f59e0b' }, // Orange + Amber
    { primary: '#ef4444', secondary: '#f43f5e' }, // Red + Rose
    { primary: '#ec4899', secondary: '#d946ef' }, // Pink + Fuchsia
    { primary: '#0f172a', secondary: '#334155' }, // Slate dark
    { primary: '#18181b', secondary: '#3f3f46' }  // Zinc dark
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 py-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Account Settings
          </h1>
          <p className="text-gray-400">
            Manage your profile, company settings, and subscription
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <PlanBadge />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
          >
            <LogOut size={16} />
            Sign Out
          </motion.button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 sticky top-8">
            <div className="flex items-center gap-3 p-3 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                {profile.type === 'company' && profile.companyLogo ? (
                  <img 
                    src={profile.companyLogo} 
                    alt={profile.companyName || "Company"}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img 
                    src={profile.profileImage} 
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <h3 className="font-medium text-white">
                  {profile.type === 'company' ? profile.companyName : `${profile.firstName} ${profile.lastName}`}
                </h3>
                <p className="text-sm text-gray-400">
                  {currentPlan.name} Plan
                </p>
              </div>
            </div>
            
            <nav className="space-y-1">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'company', label: 'Company', icon: Building },
                { id: 'billing', label: 'Billing', icon: CreditCard },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'notifications', label: 'Notifications', icon: Bell }
              ].map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </nav>
            
            <div className="mt-8 pt-4 border-t border-white/10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-all"
              >
                <HelpCircle size={18} />
                <span>Help & Support</span>
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'company' && (
              <motion.div
                key="company"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Company Settings</h2>
                
                <div className="space-y-8">
                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors"
                      placeholder="Your Company Name"
                    />
                  </div>
                  
                  {/* Company Logo */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Company Logo
                    </label>
                    
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-white/20 bg-white/10 flex items-center justify-center">
                          {companyLogo ? (
                            <img
                              src={companyLogo}
                              alt="Company Logo"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Building size={32} className="text-gray-400" />
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleBrowseClick}
                            className="p-2 bg-white/20 rounded-full"
                          >
                            <Upload size={16} className="text-white" />
                          </motion.button>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        
                        <div className="flex flex-col gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleBrowseClick}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors flex items-center gap-2"
                          >
                            <Upload size={16} />
                            Upload Logo
                          </motion.button>
                          
                          <p className="text-xs text-gray-400">
                            Recommended: Square image, at least 400x400px, PNG or JPG format
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Logo Suggestions */}
                    <div>
                      <h4 className="text-sm font-medium text-white mb-2">Suggestions</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {logoSuggestions.map((logo, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCompanyLogo(logo)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              companyLogo === logo 
                                ? 'border-indigo-500 ring-2 ring-indigo-500/30' 
                                : 'border-white/20 hover:border-white/40'
                            }`}
                          >
                            <img
                              src={logo}
                              alt={`Logo suggestion ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Brand Colors */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Brand Colors</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Primary Color */}
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Primary Color
                        </label>
                        <div className="flex items-center gap-3 mb-2">
                          <button
                            onClick={() => setShowPrimaryColorPicker(!showPrimaryColorPicker)}
                            className="w-12 h-12 rounded-lg border-2 border-white/20"
                            style={{ backgroundColor: primaryColor }}
                          />
                          <input
                            type="text"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors font-mono"
                          />
                        </div>
                        
                        {showPrimaryColorPicker && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-4"
                          >
                            <HexColorPicker color={primaryColor} onChange={setPrimaryColor} />
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Secondary Color */}
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Secondary Color
                        </label>
                        <div className="flex items-center gap-3 mb-2">
                          <button
                            onClick={() => setShowSecondaryColorPicker(!showSecondaryColorPicker)}
                            className="w-12 h-12 rounded-lg border-2 border-white/20"
                            style={{ backgroundColor: secondaryColor }}
                          />
                          <input
                            type="text"
                            value={secondaryColor}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors font-mono"
                          />
                        </div>
                        
                        {showSecondaryColorPicker && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-4"
                          >
                            <HexColorPicker color={secondaryColor} onChange={setSecondaryColor} />
                          </motion.div>
                        )}
                      </div>
                    </div>
                    
                    {/* Color Presets */}
                    <div>
                      <h4 className="text-sm font-medium text-white mb-2">Color Presets</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {colorPresets.map((preset, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setPrimaryColor(preset.primary);
                              setSecondaryColor(preset.secondary);
                            }}
                            className="p-2 rounded-lg border border-white/20 hover:border-white/40 transition-all"
                          >
                            <div className="flex gap-1 mb-1">
                              <div 
                                className="w-full h-6 rounded"
                                style={{ backgroundColor: preset.primary }}
                              />
                              <div 
                                className="w-full h-6 rounded"
                                style={{ backgroundColor: preset.secondary }}
                              />
                            </div>
                            <div className="text-xs text-center text-gray-400">
                              Preset {index + 1}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
                    
                    <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                          {companyLogo ? (
                            <img
                              src={companyLogo}
                              alt="Company Logo"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Building size={24} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{companyName}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>Brand Colors:</span>
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: primaryColor }}
                            />
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: secondaryColor }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          className="px-4 py-2 rounded-lg font-medium text-white"
                          style={{ backgroundColor: primaryColor }}
                        >
                          Primary Button
                        </button>
                        <button
                          className="px-4 py-2 rounded-lg font-medium text-white"
                          style={{ backgroundColor: secondaryColor }}
                        >
                          Secondary Button
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pro Plan Feature Notice */}
                  {userPlan === 'pro' ? (
                    <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Check size={20} className="text-purple-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-purple-400 mb-1">Pro Plan Feature</h4>
                          <p className="text-sm text-gray-300">
                            With your Pro plan, all blocks will automatically use your company's primary color to match your brand identity.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-400 mb-1">Pro Plan Feature</h4>
                          <p className="text-sm text-gray-300">
                            Upgrade to Pro to have all blocks automatically use your company's primary color to match your brand identity.
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg text-white text-sm font-medium"
                          >
                            Upgrade to Pro
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3"
                      >
                        <AlertCircle size={18} className="text-red-500" />
                        <span className="text-red-400">{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Success Message */}
                  <AnimatePresence>
                    {saveSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3"
                      >
                        <Check size={18} className="text-green-500" />
                        <span className="text-green-400">Company settings saved successfully!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Save Button */}
                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveCompanySettings}
                      disabled={isLoading}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg text-white font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw size={18} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Company Settings
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
                <p className="text-gray-400 mb-8">
                  Manage your personal profile information
                </p>
                
                {/* Profile form would go here */}
                <div className="text-center py-12 text-gray-400">
                  <User size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Profile settings coming soon</p>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'billing' && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Billing & Subscription</h2>
                <p className="text-gray-400 mb-8">
                  Manage your subscription and payment methods
                </p>
                
                {/* Billing form would go here */}
                <div className="text-center py-12 text-gray-400">
                  <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Billing settings coming soon</p>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                <p className="text-gray-400 mb-8">
                  Manage your password and security preferences
                </p>
                
                {/* Security form would go here */}
                <div className="text-center py-12 text-gray-400">
                  <Lock size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Security settings coming soon</p>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
                <p className="text-gray-400 mb-8">
                  Manage how and when you receive notifications
                </p>
                
                {/* Notifications form would go here */}
                <div className="text-center py-12 text-gray-400">
                  <Bell size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Notification settings coming soon</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};