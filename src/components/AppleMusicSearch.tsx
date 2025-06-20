import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Music, Play, Pause, ExternalLink, Clock, Calendar, Tag, User, Disc, CheckCircle, AlertCircle } from 'lucide-react';
import { appleMusicService, AppleMusicSearchResult } from '../services/appleMusicService';
import { AppleMusicData } from '../types';

interface AppleMusicSearchProps {
  onSelect: (data: AppleMusicData) => void;
  currentSelection?: AppleMusicData;
  className?: string;
}

export const AppleMusicSearch: React.FC<AppleMusicSearchProps> = ({
  onSelect,
  currentSelection,
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AppleMusicSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'songs' | 'albums' | 'artists'>('all');
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authorizationStatus, setAuthorizationStatus] = useState<'checking' | 'authorized' | 'unauthorized'>('checking');
  const [audioError, setAudioError] = useState<string | null>(null);

  // Initialiser Apple Music service
  useEffect(() => {
    const initService = async () => {
      setAuthorizationStatus('checking');
      await appleMusicService.initialize();
      const authorized = appleMusicService.isAuthorized();
      setIsAuthorized(authorized);
      setAuthorizationStatus(authorized ? 'authorized' : 'unauthorized');
      console.log('🎵 Apple Music Status:', authorized ? 'Autorisé' : 'Non autorisé');
    };
    initService();
  }, []);

  // Recherche avec debounce
  const searchDebounced = useCallback(
    debounce(async (searchQuery: string, type: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const types = type === 'all' ? ['songs', 'albums', 'artists'] : [type];
        const searchResults = await appleMusicService.search(searchQuery, types);
        setResults(searchResults);
        console.log(`🔍 Trouvé ${searchResults.length} résultats pour "${searchQuery}"`);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    searchDebounced(query, selectedType);
  }, [query, selectedType, searchDebounced]);

  const handleSelect = (result: AppleMusicSearchResult) => {
    const cardData = appleMusicService.convertToCardData(result);
    onSelect(cardData);
    console.log('✅ Sélectionné:', cardData.name);
  };

  const handlePlayPreview = async (previewUrl: string, resultId: string) => {
    setAudioError(null);
    
    // Si c'est déjà en cours de lecture, arrêter
    if (playingPreview === resultId) {
      appleMusicService.stopCurrentAudio();
      setPlayingPreview(null);
      console.log('⏹️ Lecture arrêtée');
      return;
    }

    // Arrêter toute lecture en cours
    if (playingPreview) {
      appleMusicService.stopCurrentAudio();
    }

    setPlayingPreview(resultId);
    console.log('🎵 Tentative de lecture:', previewUrl);

    try {
      const audio = await appleMusicService.playPreview(previewUrl);
      
      if (audio) {
        // Écouter la fin de la lecture
        audio.addEventListener('ended', () => {
          setPlayingPreview(null);
          console.log('🎵 Lecture terminée');
        });

        audio.addEventListener('pause', () => {
          setPlayingPreview(null);
          console.log('⏸️ Lecture en pause');
        });

        audio.addEventListener('error', (e) => {
          setPlayingPreview(null);
          setAudioError('Impossible de lire cet aperçu audio');
          console.error('❌ Erreur audio:', e);
        });
      }
    } catch (error) {
      setPlayingPreview(null);
      setAudioError('Erreur lors de la lecture de l\'aperçu');
      console.error('❌ Erreur de lecture:', error);
    }
  };

  const handleAuthorize = async () => {
    setAuthorizationStatus('checking');
    try {
      const authorized = await appleMusicService.authorize();
      setIsAuthorized(authorized);
      setAuthorizationStatus(authorized ? 'authorized' : 'unauthorized');
      console.log('🔐 Autorisation:', authorized ? 'Réussie' : 'Échouée');
    } catch (error) {
      setAuthorizationStatus('unauthorized');
      console.error('❌ Erreur d\'autorisation:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'songs': return Music;
      case 'albums': return Disc;
      case 'artists': return User;
      default: return Music;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'songs': return 'text-green-400';
      case 'albums': return 'text-blue-400';
      case 'artists': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500/20 to-red-500/20">
          <Music size={20} className="text-pink-400" />
        </div>
        <div>
          <h3 className="font-medium text-white">Apple Music</h3>
          <p className="text-xs text-gray-400">
            Recherchez et intégrez du contenu musical
          </p>
        </div>
      </div>

      {/* Authorization Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg border ${
          authorizationStatus === 'authorized' 
            ? 'bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20'
            : authorizationStatus === 'checking'
            ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20'
            : 'bg-gradient-to-r from-pink-500/10 to-red-500/10 border-pink-500/20'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {authorizationStatus === 'authorized' ? (
              <CheckCircle size={20} className="text-green-400" />
            ) : authorizationStatus === 'checking' ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full"
              />
            ) : (
              <AlertCircle size={20} className="text-pink-400" />
            )}
            <div>
              <h4 className={`font-medium text-sm ${
                authorizationStatus === 'authorized' ? 'text-green-400' :
                authorizationStatus === 'checking' ? 'text-yellow-400' : 'text-pink-400'
              }`}>
                {authorizationStatus === 'authorized' ? 'Connecté à Apple Music' :
                 authorizationStatus === 'checking' ? 'Vérification...' : 'Mode Simulation'}
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                {authorizationStatus === 'authorized' 
                  ? 'Accès complet aux aperçus et fonctionnalités'
                  : authorizationStatus === 'checking'
                  ? 'Vérification de la connexion Apple Music...'
                  : 'Fonctionnalités de base disponibles (pas de Developer Token)'
                }
              </p>
            </div>
          </div>
          {authorizationStatus === 'unauthorized' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAuthorize}
              className="px-3 py-1 bg-pink-500 hover:bg-pink-600 rounded-lg text-xs font-medium transition-colors"
            >
              Se connecter
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Audio Error */}
      <AnimatePresence>
        {audioError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2"
          >
            <AlertCircle size={16} className="text-red-400" />
            <span className="text-sm text-red-400">{audioError}</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setAudioError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              ×
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Types */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
        {[
          { id: 'all', label: 'Tout' },
          { id: 'songs', label: 'Morceaux' },
          { id: 'albums', label: 'Albums' },
          { id: 'artists', label: 'Artistes' }
        ].map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedType(type.id as any)}
            className={`flex-1 p-2 rounded-md text-xs font-medium transition-all ${
              selectedType === type.id
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {type.label}
          </motion.button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher des morceaux, albums, artistes..."
          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:border-white/40 focus:outline-none transition-colors"
        />
        {isSearching && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-white/20 border-t-pink-400 rounded-full"
          />
        )}
      </div>

      {/* Current Selection */}
      {currentSelection && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20"
        >
          <div className="flex items-center gap-3">
            {currentSelection.artwork && (
              <img
                src={currentSelection.artwork}
                alt={currentSelection.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white text-sm truncate">
                {currentSelection.name}
              </h4>
              <p className="text-xs text-gray-400 truncate">
                {currentSelection.artistName} • {currentSelection.type}
              </p>
            </div>
            <div className="text-green-400">
              <CheckCircle size={16} />
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {results.map((result, index) => {
            const TypeIcon = getTypeIcon(result.type);
            const typeColor = getTypeColor(result.type);
            const artwork = result.attributes.artwork;
            const artworkUrl = artwork ? appleMusicService.getArtworkUrl(artwork, 400) : '';
            const hasPreview = result.attributes.previews && result.attributes.previews.length > 0;
            const isPlaying = playingPreview === result.id;

            return (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(result)}
                  className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    {/* Artwork */}
                    <div className="relative flex-shrink-0">
                      {artworkUrl ? (
                        <img
                          src={artworkUrl}
                          alt={result.attributes.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                          <TypeIcon size={20} className={typeColor} />
                        </div>
                      )}
                      
                      {/* Play button overlay */}
                      {hasPreview && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayPreview(result.attributes.previews![0].url, result.id);
                          }}
                          className={`absolute inset-0 rounded-lg flex items-center justify-center transition-all ${
                            isPlaying 
                              ? 'bg-green-500/80 opacity-100' 
                              : 'bg-black/50 opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          {isPlaying ? (
                            <Pause size={16} className="text-white" />
                          ) : (
                            <Play size={16} className="text-white" />
                          )}
                        </motion.button>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white text-sm truncate">
                          {result.attributes.name}
                        </h4>
                        <TypeIcon size={12} className={typeColor} />
                        {isPlaying && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-2 h-2 bg-green-400 rounded-full"
                          />
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {result.attributes.artistName && (
                          <p className="text-xs text-gray-400 truncate">
                            <User size={10} className="inline mr-1" />
                            {result.attributes.artistName}
                          </p>
                        )}
                        
                        {result.attributes.albumName && (
                          <p className="text-xs text-gray-400 truncate">
                            <Disc size={10} className="inline mr-1" />
                            {result.attributes.albumName}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          {result.attributes.durationInMillis && (
                            <span className="flex items-center gap-1">
                              <Clock size={10} />
                              {appleMusicService.formatDuration(result.attributes.durationInMillis)}
                            </span>
                          )}
                          
                          {result.attributes.releaseDate && (
                            <span className="flex items-center gap-1">
                              <Calendar size={10} />
                              {new Date(result.attributes.releaseDate).getFullYear()}
                            </span>
                          )}
                          
                          {result.attributes.genreNames && result.attributes.genreNames.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Tag size={10} />
                              {result.attributes.genreNames[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* External link */}
                    {result.attributes.url && (
                      <motion.a
                        href={result.attributes.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <ExternalLink size={14} className="text-gray-400" />
                      </motion.a>
                    )}
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty state */}
        {query && !isSearching && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-400"
          >
            <Music size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun résultat trouvé pour "{query}"</p>
            <p className="text-xs mt-1">Essayez avec d'autres mots-clés</p>
          </motion.div>
        )}

        {/* No query state */}
        {!query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-400"
          >
            <Search size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Recherchez votre musique préférée</p>
            <p className="text-xs mt-1">Morceaux, albums, artistes...</p>
          </motion.div>
        )}
      </div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20"
      >
        <div className="flex items-start gap-3">
          <div className="p-1 rounded bg-pink-500/20">
            <Music size={14} className="text-pink-400" />
          </div>
          <div>
            <h4 className="font-medium text-pink-400 text-sm">Apple Music</h4>
            <p className="text-xs text-gray-400 mt-1">
              {authorizationStatus === 'authorized' 
                ? 'Intégrez facilement vos morceaux, albums et artistes préférés. Cliquez sur ▶️ pour écouter les aperçus.'
                : 'Mode simulation activé. Les fonctionnalités de base sont disponibles. Pour une expérience complète, configurez votre Developer Token Apple Music.'
              }
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}