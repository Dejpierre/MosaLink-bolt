import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, ExternalLink, Settings, X, Check, AlertCircle } from 'lucide-react';
import { CalendlyData } from '../types';

interface CalendlyIntegrationProps {
  currentSelection?: CalendlyData;
  onSelect: (data: CalendlyData) => void;
  className?: string;
}

export const CalendlyIntegration: React.FC<CalendlyIntegrationProps> = ({
  currentSelection,
  onSelect,
  className = ''
}) => {
  const [calendlyUrl, setCalendlyUrl] = useState(currentSelection?.url || '');
  const [displayMode, setDisplayMode] = useState<CalendlyData['displayMode']>(currentSelection?.displayMode || 'popup');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [embedHeight, setEmbedHeight] = useState(currentSelection?.embedHeight || 630);
  const [primaryColor, setPrimaryColor] = useState(currentSelection?.primaryColor || '#00a2ff');
  const [error, setError] = useState<string | null>(null);

  // Préfill data
  const [prefillName, setPrefillName] = useState(currentSelection?.prefill?.name || '');
  const [prefillEmail, setPrefillEmail] = useState(currentSelection?.prefill?.email || '');

  // UTM parameters
  const [utmCampaign, setUtmCampaign] = useState(currentSelection?.utm?.utmCampaign || '');
  const [utmSource, setUtmSource] = useState(currentSelection?.utm?.utmSource || '');

  const validateCalendlyUrl = (url: string): boolean => {
    if (!url) return false;
    
    // Vérifier que c'est une URL Calendly valide
    const calendlyRegex = /^https:\/\/calendly\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/;
    return calendlyRegex.test(url);
  };

  const handleUrlChange = (url: string) => {
    setCalendlyUrl(url);
    setError(null);
    
    if (url && !validateCalendlyUrl(url)) {
      setError('URL Calendly invalide. Format attendu: https://calendly.com/username/meeting');
    }
  };

  const handleApply = () => {
    if (!calendlyUrl) {
      setError('Veuillez entrer une URL Calendly');
      return;
    }

    if (!validateCalendlyUrl(calendlyUrl)) {
      setError('URL Calendly invalide');
      return;
    }

    const calendlyData: CalendlyData = {
      url: calendlyUrl,
      displayMode,
      embedHeight: displayMode === 'inline' ? embedHeight : undefined,
      primaryColor,
      prefill: (prefillName || prefillEmail) ? {
        name: prefillName || undefined,
        email: prefillEmail || undefined
      } : undefined,
      utm: (utmCampaign || utmSource) ? {
        utmCampaign: utmCampaign || undefined,
        utmSource: utmSource || undefined
      } : undefined
    };

    onSelect(calendlyData);
    setError(null);
  };

  const exampleUrls = [
    'https://calendly.com/john-doe/30min',
    'https://calendly.com/jane-smith/consultation',
    'https://calendly.com/company/demo',
    'https://calendly.com/coach/session'
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
          <Calendar size={20} className="text-blue-400" />
        </div>
        <div>
          <h3 className="font-medium text-white">Calendly</h3>
          <p className="text-xs text-gray-400">
            Intégrez vos rendez-vous Calendly directement dans votre carte
          </p>
        </div>
      </div>

      {/* Current Selection */}
      {currentSelection && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20"
        >
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-green-400" />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white text-sm truncate">
                {currentSelection.url.split('/').pop()}
              </h4>
              <p className="text-xs text-gray-400 truncate">
                Mode: {currentSelection.displayMode} • {currentSelection.url}
              </p>
            </div>
            <div className="text-green-400">
              <Check size={16} />
            </div>
          </div>
        </motion.div>
      )}

      {/* URL Input */}
      <div>
        <label className="block text-sm font-medium mb-2 text-white">
          URL Calendly *
        </label>
        <input
          type="url"
          value={calendlyUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://calendly.com/username/meeting"
          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors text-white placeholder-white/60"
        />
        {error && (
          <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
      </div>

      {/* Display Mode */}
      <div>
        <label className="block text-sm font-medium mb-2 text-white">
          Mode d'affichage
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'popup', label: 'Popup', description: 'Ouvre dans une popup' },
            { id: 'inline', label: 'Intégré', description: 'Affiché dans la carte' },
            { id: 'redirect', label: 'Redirection', description: 'Ouvre dans un nouvel onglet' }
          ].map((mode) => (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDisplayMode(mode.id as CalendlyData['displayMode'])}
              className={`p-3 rounded-lg border transition-all text-left ${
                displayMode === mode.id
                  ? 'border-blue-400 bg-blue-500/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="font-medium text-white text-sm">{mode.label}</div>
              <div className="text-xs text-gray-400 mt-1">{mode.description}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Hauteur pour le mode inline */}
      {displayMode === 'inline' && (
        <div>
          <label className="block text-sm font-medium mb-2 text-white">
            Hauteur d'intégration
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="400"
              max="800"
              step="10"
              value={embedHeight}
              onChange={(e) => setEmbedHeight(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-white font-mono text-sm w-16">{embedHeight}px</span>
          </div>
        </div>
      )}

      {/* Couleur principale */}
      <div>
        <label className="block text-sm font-medium mb-2 text-white">
          Couleur principale
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="w-12 h-12 rounded-lg border border-white/20 bg-transparent"
          />
          <input
            type="text"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="flex-1 p-2 rounded-lg bg-white/10 border border-white/20 text-white font-mono text-sm"
          />
        </div>
      </div>

      {/* Options avancées */}
      <div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
        >
          <Settings size={14} />
          Options avancées
          <motion.div
            animate={{ rotate: showAdvanced ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-4 p-4 rounded-lg bg-white/5 border border-white/10"
            >
              {/* Préfill */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Nom préfill</label>
                  <input
                    type="text"
                    value={prefillName}
                    onChange={(e) => setPrefillName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full p-2 rounded bg-white/10 border border-white/20 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Email préfill</label>
                  <input
                    type="email"
                    value={prefillEmail}
                    onChange={(e) => setPrefillEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full p-2 rounded bg-white/10 border border-white/20 text-white text-sm"
                  />
                </div>
              </div>

              {/* UTM Parameters */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">UTM Campaign</label>
                  <input
                    type="text"
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e.target.value)}
                    placeholder="website"
                    className="w-full p-2 rounded bg-white/10 border border-white/20 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">UTM Source</label>
                  <input
                    type="text"
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    placeholder="mosalink"
                    className="w-full p-2 rounded bg-white/10 border border-white/20 text-white text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Exemples d'URLs */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-400">Exemples d'URLs</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {exampleUrls.map((url, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUrlChange(url)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left"
            >
              <div className="text-sm text-white font-mono">{url}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bouton d'application */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleApply}
        disabled={!calendlyUrl || !!error}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2"
      >
        <Calendar size={16} />
        Appliquer Calendly
      </motion.button>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
      >
        <div className="flex items-start gap-3">
          <div className="p-1 rounded bg-blue-500/20">
            <Calendar size={14} className="text-blue-400" />
          </div>
          <div>
            <h4 className="font-medium text-blue-400 text-sm">Intégration Calendly</h4>
            <ul className="text-xs text-gray-400 mt-1 space-y-1">
              <li>• <strong>Popup</strong>: Ouvre Calendly dans une fenêtre popup élégante</li>
              <li>• <strong>Intégré</strong>: Affiche Calendly directement dans la carte (recommandé pour les grandes cartes)</li>
              <li>• <strong>Redirection</strong>: Ouvre Calendly dans un nouvel onglet</li>
              <li>• Personnalisez les couleurs pour correspondre à votre marque</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};