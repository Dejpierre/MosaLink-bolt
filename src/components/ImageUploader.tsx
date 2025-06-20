import React, { useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image, X, Check, AlertCircle, Camera, Link, Folder, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  onImageRemove: () => void;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageChange,
  onImageRemove,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('url');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simuler l'upload (en production, vous utiliseriez un service comme Cloudinary, AWS S3, etc.)
  const simulateUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        reject(new Error('Le fichier doit être une image'));
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('L\'image doit faire moins de 5MB'));
        return;
      }

      // Simuler le progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        setUploadProgress(Math.min(progress, 90));
      }, 100);

      // Convertir en base64 ou utiliser FileReader pour l'aperçu
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
      const imageUrl = await simulateUpload(file);
      onImageChange(imageUrl);
      setIsUploading(false);
      setUploadProgress(0);
      console.log('✅ Image uploadée avec succès');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
      setIsUploading(false);
      setUploadProgress(0);
      console.error('❌ Erreur upload:', err);
    }
  }, [onImageChange]);

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

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      // Validation basique de l'URL
      try {
        new URL(urlInput);
        onImageChange(urlInput.trim());
        setUrlInput('');
        setError(null);
        console.log('✅ URL d\'image ajoutée:', urlInput.trim());
      } catch {
        setError('URL invalide');
        console.error('❌ URL invalide:', urlInput);
      }
    }
  };

  const handleUrlKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUrlSubmit();
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Images d'exemple de haute qualité
  const exampleImages = [
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1438761/pexels-photo-1438761.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Aperçu de l'image actuelle */}
      {currentImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <img
            src={currentImage}
            alt="Aperçu"
            className="w-full h-32 object-cover rounded-lg border border-white/20"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onImageRemove}
            className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </motion.button>
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-medium">Changer l'image</span>
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
                  ? 'border-indigo-400 bg-indigo-500/10 scale-105' 
                  : 'border-white/30 hover:border-white/50 hover:bg-white/5'
                }
                ${isUploading ? 'pointer-events-none' : ''}
              `}
            >
              {/* Input file caché */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
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
                      className="w-12 h-12 mx-auto rounded-full border-4 border-white/20 border-t-indigo-400"
                    />
                    <div>
                      <div className="text-sm font-medium text-white mb-2">Upload en cours...</div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
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
                          ? 'bg-indigo-500/20 text-indigo-400' 
                          : 'bg-white/10 text-gray-400'
                      }`}
                    >
                      {isDragging ? <Camera size={24} /> : <Upload size={24} />}
                    </motion.div>
                    <div>
                      <div className="text-sm font-medium text-white mb-1">
                        {isDragging ? 'Déposez votre image ici' : 'Glissez une image ou parcourez'}
                      </div>
                      <div className="text-xs text-gray-400 mb-3">
                        PNG, JPG, GIF jusqu'à 5MB
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
                placeholder="https://example.com/image.jpg"
                className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors text-white placeholder-white/60"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
                className="px-4 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <Check size={16} className="text-white" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Images d'exemple */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Folder size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-400">Images d'exemple</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const randomImage = exampleImages[Math.floor(Math.random() * exampleImages.length)];
              onImageChange(randomImage);
            }}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
          >
            <RefreshCw size={12} />
            Aléatoire
          </motion.button>
        </div>
        <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
          {exampleImages.map((img, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onImageChange(img)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                currentImage === img 
                  ? 'border-indigo-400 ring-2 ring-indigo-400/50' 
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <img
                src={img}
                alt={`Exemple ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Conseils d'utilisation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
      >
        <div className="flex items-start gap-3">
          <div className="p-1 rounded bg-blue-500/20">
            <Image size={14} className="text-blue-400" />
          </div>
          <div>
            <h4 className="font-medium text-blue-400 text-sm">Conseils pour de belles images</h4>
            <ul className="text-xs text-gray-400 mt-1 space-y-1">
              <li>• Utilisez des images haute résolution (min. 800px)</li>
              <li>• Privilégiez les formats JPG ou PNG</li>
              <li>• Les images avec du contraste fonctionnent mieux</li>
              <li>• Évitez les images trop chargées pour la lisibilité</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};