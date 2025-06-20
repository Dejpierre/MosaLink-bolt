import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ProfilePlacement } from '../types';
import { 
  X, 
  User, 
  Grid, 
  ArrowRight, 
  Check, 
  AlertCircle,
  Crown,
  Settings,
  Eye,
  Layout,
  Plus,
  Trash2
} from 'lucide-react';

interface ProfilePlacementSelectorProps {
  onClose: () => void;
}

export const ProfilePlacementSelector: React.FC<ProfilePlacementSelectorProps> = ({ onClose }) => {
  const { 
    profilePlacement, 
    updateProfilePlacement, 
    createProfileCard, 
    removeProfileCard, 
    getProfileCard,
    profile,
    userPlan
  } = useStore();
  
  const [selectedMode, setSelectedMode] = useState<ProfilePlacement['mode']>(profilePlacement.mode);
  const [isCreating, setIsCreating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profileCard = getProfileCard();

  const handleModeChange = async (mode: ProfilePlacement['mode']) => {
    setError(null);
    
    if (mode === 'bento') {
      // Si on passe en mode bento, créer une carte profil
      if (!profileCard) {
        setIsCreating(true);
        const result = await createProfileCard();
        setIsCreating(false);
        
        if (result.success) {
          setSelectedMode('bento');
          updateProfilePlacement({
            mode: 'bento',
            cardId: result.cardId
          });
        } else {
          setError(result.error || 'Erreur lors de la création de la carte profil');
        }
      } else {
        // La carte existe déjà
        setSelectedMode('bento');
        updateProfilePlacement({
          mode: 'bento',
          cardId: profileCard.id
        });
      }
    } else {
      // Si on passe en mode header, supprimer la carte profil si elle existe
      if (profileCard) {
        setIsRemoving(true);
        removeProfileCard();
        setIsRemoving(false);
      }
      
      setSelectedMode('header');
      updateProfilePlacement({
        mode: 'header',
        headerStyle: 'compact'
      });
    }
  };

  const handleApply = () => {
    onClose();
  };

  const canCreateProfileCard = () => {
    // Vérifier les limites du plan
    if (userPlan === 'free') return false; // Plan gratuit ne peut pas créer de carte profil
    return true;
  };

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
        className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Placement du Profil
            </h2>
            <p className="text-gray-400 mt-1">
              Choisissez où afficher votre profil
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </motion.button>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-6">
          {/* Mode Header */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleModeChange('header')}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
              selectedMode === 'header'
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                selectedMode === 'header' 
                  ? 'bg-indigo-500/20' 
                  : 'bg-white/10'
              }`}>
                <Layout size={24} className={
                  selectedMode === 'header' ? 'text-indigo-400' : 'text-gray-400'
                } />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">En-tête de page</h3>
                  {selectedMode === 'header' && (
                    <Check size={16} className="text-indigo-400" />
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  Votre profil s'affiche en haut de la page, au-dessus de la grille. 
                  C'est l'option classique et recommandée.
                </p>
                
                {/* Aperçu */}
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600" />
                    <div>
                      <div className="w-24 h-2 bg-white/30 rounded mb-1" />
                      <div className="w-16 h-1.5 bg-white/20 rounded" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1 h-8">
                    <div className="bg-white/20 rounded" />
                    <div className="bg-white/20 rounded" />
                    <div className="bg-white/20 rounded" />
                    <div className="bg-white/20 rounded" />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 text-xs text-green-400">
                  <Check size={12} />
                  <span>Toujours visible</span>
                  <span>•</span>
                  <Check size={12} />
                  <span>Pas de limite de cartes</span>
                  <span>•</span>
                  <Check size={12} />
                  <span>Tous les plans</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mode Bento */}
          <motion.div
            whileHover={{ scale: canCreateProfileCard() ? 1.02 : 1 }}
            whileTap={{ scale: canCreateProfileCard() ? 0.98 : 1 }}
            onClick={() => canCreateProfileCard() && handleModeChange('bento')}
            className={`p-6 rounded-xl border-2 transition-all ${
              !canCreateProfileCard()
                ? 'border-gray-600 bg-gray-800/50 cursor-not-allowed opacity-60'
                : selectedMode === 'bento'
                ? 'border-orange-500 bg-orange-500/10 cursor-pointer'
                : 'border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                selectedMode === 'bento' 
                  ? 'bg-orange-500/20' 
                  : canCreateProfileCard()
                  ? 'bg-white/10'
                  : 'bg-gray-700/50'
              }`}>
                <Grid size={24} className={
                  selectedMode === 'bento' 
                    ? 'text-orange-400' 
                    : canCreateProfileCard()
                    ? 'text-gray-400'
                    : 'text-gray-600'
                } />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">Bloc Bento</h3>
                  {selectedMode === 'bento' && (
                    <Check size={16} className="text-orange-400" />
                  )}
                  {!canCreateProfileCard() && (
                    <Crown size={16} className="text-yellow-400" />
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  Votre profil devient une carte dans la grille. Plus créatif et personnalisable, 
                  mais compte dans votre limite de cartes.
                </p>
                
                {/* Aperçu */}
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="grid grid-cols-4 gap-1 h-12">
                    <div className="col-span-2 bg-gradient-to-br from-orange-500/30 to-pink-500/30 rounded flex items-center justify-center">
                      <User size={16} className="text-orange-400" />
                    </div>
                    <div className="bg-white/20 rounded" />
                    <div className="bg-white/20 rounded" />
                  </div>
                </div>

                {canCreateProfileCard() ? (
                  <div className="flex items-center gap-2 mt-3 text-xs text-orange-400">
                    <Check size={12} />
                    <span>Intégré à la grille</span>
                    <span>•</span>
                    <Check size={12} />
                    <span>Personnalisable</span>
                    <span>•</span>
                    <AlertCircle size={12} />
                    <span>Compte comme 1 carte</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-3 text-xs text-yellow-400">
                    <Crown size={12} />
                    <span>Nécessite un plan payant</span>
                    <span>•</span>
                    <AlertCircle size={12} />
                    <span>Fonctionnalité premium</span>
                  </div>
                )}

                {/* État actuel */}
                {profileCard && (
                  <div className="mt-3 p-2 rounded bg-orange-500/10 border border-orange-500/20">
                    <div className="flex items-center gap-2 text-xs text-orange-400">
                      <Grid size={12} />
                      <span>Carte profil existante: "{profileCard.title}"</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Messages d'erreur */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2"
            >
              <AlertCircle size={16} className="text-red-400" />
              <span className="text-sm text-red-400">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
          >
            Annuler
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleApply}
            disabled={isCreating || isRemoving}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Création...
              </>
            ) : isRemoving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Check size={16} />
                Appliquer
              </>
            )}
          </motion.button>
        </div>

        {/* Info sur les plans */}
        {userPlan === 'free' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
          >
            <div className="flex items-start gap-3">
              <Crown size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-400 mb-1">Fonctionnalité Premium</h4>
                <p className="text-sm text-gray-400">
                  Le mode "Bloc Bento" est disponible avec les plans Starter et Pro. 
                  Passez à un plan supérieur pour intégrer votre profil directement dans la grille.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};