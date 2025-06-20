import React, { useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Video, X, Check, AlertCircle, Play, Link, Folder, Settings } from 'lucide-react';

interface VideoUploaderProps {
  currentVideo?: string;
  videoSettings?: {
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    controls?: boolean;
    overlay?: boolean;
  };
  onVideoChange: (videoUrl: string) => void;
  onVideoRemove: () => void;
  onSettingsChange: (settings: any) => void;
  className?: string;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  currentVideo,
  videoSettings = {
    autoplay: true,
    muted: true,
    loop: true,
    controls: false,
    overlay: true
  },
  onVideoChange,
  onVideoRemove,
  onSettingsChange,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('url');
  const [urlInput, setUrlInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simuler l'upload vidéo (en production, vous utiliseriez un service comme Cloudinary, AWS S3, etc.)
  const simulateUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Vérifier le type de fichier
      if (!file.type.startsWith('video/')) {
        reject(new Error('Le fichier doit être une vidéo'));
        return;
      }

      // Vérifier la taille (max 50MB pour les vidéos)
      if (file.size > 50 * 1024 * 1024) {
        reject(new Error('La vidéo doit faire moins de 50MB'));
        return;
      }

      // Simuler le progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        setUploadProgress(Math.min(progress, 90));
      }, 200);

      // Convertir en URL pour l'aperçu (en production, vous uploaderiez vers un CDN)
      const reader = new FileReader();
      reader.onload = () => {
        clearInterval(interval);
        setUploadProgress(100);
        
        setTimeout(() => {
          resolve(reader.result as string);
        }, 500);
      };
      reader.onerror = () => {
        clearInterval(interval);
        reject(new Error('Erreur lors de la lecture du fichier'));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const videoUrl = await simulateUpload(file);
      onVideoChange(videoUrl);
      setIsUploading(false);
      setUploadProgress(0);
      console.log('✅ Vidéo uploadée avec succès');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
      setIsUploading(false);
      setUploadProgress(0);
      console.error('❌ Erreur upload vidéo:', err);
    }
  }, [onVideoChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      // Validation basique de l'URL vidéo
      const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
      const isVideoUrl = videoExtensions.some(ext => urlInput.toLowerCase().includes(ext)) || 
                        urlInput.includes('youtube.com') || 
                        urlInput.includes('vimeo.com') ||
                        urlInput.includes('youtu.be');
      
      if (isVideoUrl || urlInput.startsWith('data:video/')) {
        onVideoChange(urlInput.trim());
        setUrlInput('');
        setError(null);
        console.log('✅ URL vidéo ajoutée:', urlInput.trim());
      } else {
        setError('URL de vidéo invalide. Utilisez .mp4, .webm, YouTube ou Vimeo');
        console.error('❌ URL vidéo invalide:', urlInput);
      }
    }
  };

  const handleUrlKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUrlSubmit();
    }
  };

  const handleSettingChange = (key: string, value: boolean) => {
    const newSettings = { ...videoSettings, [key]: value };
    onSettingsChange(newSettings);
  };

  // Vidéos d'exemple de haute qualité
  const exampleVideos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Aperçu de la vidéo actuelle */}
      {currentVideo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <video
            src={currentVideo}
            className="w-full h-32 object-cover rounded-lg border border-white/20"
            autoPlay={videoSettings.autoplay}
            muted={videoSettings.muted}
            loop={videoSettings.loop}
            controls={videoSettings.controls}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onVideoRemove}
            className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </motion.button>
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-medium">Changer la vidéo</span>
          </div>
        </motion.div>
      )}

      {/* Sélecteur de méthode d'upload */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setUploadMethod('file')}
          className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md text-sm font-medium transition-all ${
            uploadMethod === 'file'
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Upload size={16} />
          Fichier
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setUploadMethod('url')}
          className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md text-sm font-medium transition-all ${
            uploadMethod === 'url'
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Link size={16} />
          URL
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {uploadMethod === 'file' ? (
          <motion.div
            key="file-upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Zone de drop */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300
                ${isDragging 
                  ? 'border-purple-400 bg-purple-500/10 scale-105' 
                  : 'border-white/30 hover:border-white/50 hover:bg-white/5'
                }
                ${isUploading ? 'pointer-events-none' : ''}
              `}
            >
              {/* Input file caché */}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                disabled={isUploading}
              />

              <AnimatePresence mode="wait">
                {isUploading ? (
                  <motion.div
                    key="uploading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="space-y-3"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-12 h-12 mx-auto rounded-full border-4 border-white/20 border-t-purple-400"
                    />
                    <div>
                      <div className="text-sm font-medium text-white mb-2">Upload vidéo en cours...</div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{Math.round(uploadProgress)}%</div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload-prompt"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="space-y-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center ${
                        isDragging 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'bg-white/10 text-gray-400'
                      }`}
                    >
                      {isDragging ? <Play size={24} /> : <Video size={24} />}
                    </motion.div>
                    <div>
                      <div className="text-sm font-medium text-white mb-1">
                        {isDragging ? 'Déposez votre vidéo ici' : 'Glissez une vidéo ou parcourez'}
                      </div>
                      <div className="text-xs text-gray-400 mb-3">
                        MP4, WebM, MOV jusqu'à 50MB
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleBrowseClick}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
                      >
                        Parcourir
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="url-input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Input URL */}
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={handleUrlKeyDown}
                placeholder="https://example.com/video.mp4 ou YouTube/Vimeo URL"
                className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors text-white placeholder-white/60"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
                className="px-4 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <Check size={16} className="text-white" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paramètres vidéo */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-400">Paramètres vidéo</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="text-xs text-indigo-400 hover:text-indigo-300"
          >
            {showSettings ? 'Masquer' : 'Afficher'}
          </motion.button>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
            >
              {[
                { key: 'autoplay', label: 'Lecture auto' },
                { key: 'muted', label: 'Muet' },
                { key: 'loop', label: 'Boucle' },
                { key: 'controls', label: 'Contrôles' },
                { key: 'overlay', label: 'Overlay texte' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={videoSettings[key as keyof typeof videoSettings] || false}
                    onChange={(e) => handleSettingChange(key, e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-300">{label}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages d'erreur */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400"
          >
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setError(null)}
              className="ml-auto p-1 hover:bg-red-500/20 rounded"
            >
              <X size={14} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vidéos d'exemple */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Folder size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-400">Vidéos d'exemple</span>
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
          {exampleVideos.map((video, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onVideoChange(video)}
              className={`aspect-video rounded-lg overflow-hidden border-2 transition-all relative group ${
                currentVideo === video 
                  ? 'border-purple-400 ring-2 ring-purple-400/50' 
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <video
                src={video}
                className="w-full h-full object-cover"
                muted
                loop
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play size={16} className="text-white" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Conseils d'utilisation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20"
      >
        <div className="flex items-start gap-3">
          <div className="p-1 rounded bg-purple-500/20">
            <Video size={14} className="text-purple-400" />
          </div>
          <div>
            <h4 className="font-medium text-purple-400 text-sm">Conseils pour les vidéos</h4>
            <ul className="text-xs text-gray-400 mt-1 space-y-1">
              <li>• Utilisez des vidéos courtes (moins de 30s) pour de meilleures performances</li>
              <li>• Activez "Muet" et "Lecture auto" pour une expérience fluide</li>
              <li>• Les formats MP4 et WebM sont recommandés</li>
              <li>• L'overlay permet d'afficher le texte par-dessus la vidéo</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};