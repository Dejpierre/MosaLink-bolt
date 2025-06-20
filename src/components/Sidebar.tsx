import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ExportImport } from './ExportImport';
import { TemplateManager } from './TemplateManager';
import { Undo, Redo, X, Save, Layers, Download, User, Building } from 'lucide-react';
import { PlanBadge } from './subscription/PlanBadge';

interface SidebarProps {
  onClose?: () => void;
  children?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose, children }) => {
  const { undo, redo, history, historyIndex, profile, updateProfile } = useStore();
  const [activeTab, setActiveTab] = useState<'templates' | 'layouts' | 'settings' | 'profile'>('templates');
  const [showTemplateManager, setShowTemplateManager] = useState(false);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const tabs = [
    { id: 'templates', label: 'Templates', icon: Save },
    { id: 'layouts', label: 'Layouts', icon: Layers },
    { id: 'settings', label: 'Export', icon: Download },
    { id: 'profile', label: 'Profile', icon: profile.type === 'company' ? Building : User }
  ];

  const handleProfileTypeChange = (type: 'personal' | 'company') => {
    updateProfile({ ...profile, type });
  };

  return (
    <>
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="h-full bg-white/10 backdrop-blur-xl border-r border-white/20 dark:bg-gray-900/50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Editor</h2>
            {onClose && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-white"
              >
                <X size={18} />
              </motion.button>
            )}
          </div>

          {/* Undo/Redo */}
          <div className="flex gap-2 mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!canUndo}
              onClick={undo}
              className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors text-white"
            >
              <Undo size={16} />
              Undo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!canRedo}
              onClick={redo}
              className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors text-white"
            >
              <Redo size={16} />
              Redo
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {activeTab === 'templates' && (
                <div className="p-6">
                  <div className="text-center text-gray-400">
                    <h3 className="text-lg font-medium mb-4">Templates de Cartes</h3>
                    <p className="text-sm mb-6">
                      Choisissez parmi nos templates élégants pour créer rapidement de nouvelles cartes.
                    </p>
                  </div>
                </div>
              )}
              
              {activeTab === 'layouts' && (
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-white">Gestionnaire de Layouts</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Sauvegardez et réutilisez vos mises en page complètes.
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowTemplateManager(true)}
                      className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 hover:from-indigo-500/30 hover:to-purple-600/30 transition-all"
                    >
                      <Layers size={20} />
                      <div className="text-left">
                        <div className="font-medium text-white">Ouvrir le gestionnaire</div>
                        <div className="text-sm text-gray-400">Gérer vos templates de mise en page</div>
                      </div>
                    </motion.button>

                    <div className="grid grid-cols-1 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowTemplateManager(true)}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left"
                      >
                        <Save size={18} className="text-green-400" />
                        <div>
                          <div className="font-medium text-white">Sauvegarder la mise en page</div>
                          <div className="text-xs text-gray-400">Créer un template de votre configuration actuelle</div>
                        </div>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowTemplateManager(true)}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left"
                      >
                        <Download size={18} className="text-blue-400" />
                        <div>
                          <div className="font-medium text-white">Charger un template</div>
                          <div className="text-xs text-gray-400">Utiliser un template existant</div>
                        </div>
                      </motion.button>
                    </div>

                    {/* Info */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-1 rounded bg-indigo-500/20">
                          <Layers size={16} className="text-indigo-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-indigo-400 text-sm">Templates de Mise en Page</h4>
                          <p className="text-xs text-gray-400 mt-1">
                            Sauvegardez votre configuration complète (cartes + profil) comme template réutilisable. 
                            Parfait pour créer des variations ou partager vos créations.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div className="p-6">
                  <ExportImport />
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Type de profil</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {/* Personal Profile Option */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleProfileTypeChange('personal')}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          profile.type === 'personal'
                            ? 'border-indigo-500 bg-indigo-500/10'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${
                            profile.type === 'personal' ? 'bg-indigo-500/20' : 'bg-white/10'
                          }`}>
                            <User size={18} className={profile.type === 'personal' ? 'text-indigo-400' : 'text-gray-400'} />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">Profil Personnel</h4>
                            <p className="text-xs text-gray-400">Pour les créateurs individuels</p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-400 mt-2">
                          Affiche votre nom, photo et informations de contact. Idéal pour les créateurs de contenu, freelances et portfolios personnels.
                        </p>
                      </motion.div>

                      {/* Company Profile Option */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleProfileTypeChange('company')}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          profile.type === 'company'
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${
                            profile.type === 'company' ? 'bg-blue-500/20' : 'bg-white/10'
                          }`}>
                            <Building size={18} className={profile.type === 'company' ? 'text-blue-400' : 'text-gray-400'} />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">Profil Entreprise</h4>
                            <p className="text-xs text-gray-400">Pour les marques et entreprises</p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-400 mt-2">
                          Affiche votre logo d'entreprise centré au-dessus de la grille. Idéal pour les marques, startups et entreprises.
                        </p>
                      </motion.div>
                    </div>

                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="font-medium text-white mb-2">Profil actuel</h4>
                      <div className="flex items-center gap-3">
                        {profile.type === 'personal' ? (
                          <>
                            <img 
                              src={profile.profileImage} 
                              alt={`${profile.firstName} ${profile.lastName}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-white font-medium">{profile.firstName} {profile.lastName}</p>
                              <p className="text-xs text-gray-400">{profile.location || 'Aucun emplacement'}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            {profile.companyLogo ? (
                              <img 
                                src={profile.companyLogo} 
                                alt={profile.companyName}
                                className="w-10 h-10 object-contain"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <Building size={20} className="text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="text-white font-medium">{profile.companyName || 'Nom de l\'entreprise'}</p>
                              <p className="text-xs text-gray-400">{profile.location || 'Aucun emplacement'}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Render children (for mobile navigation) */}
        {children}
      </motion.div>

      {/* Template Manager Modal */}
      <AnimatePresence>
        {showTemplateManager && (
          <TemplateManager onClose={() => setShowTemplateManager(false)} />
        )}
      </AnimatePresence>
    </>
  );
};