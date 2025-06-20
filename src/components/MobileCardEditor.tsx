import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { 
  X, 
  Save, 
  Trash2, 
  Type, 
  Palette
} from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

interface MobileCardEditorProps {
  cardId: string;
  onClose: () => void;
}

export const MobileCardEditor: React.FC<MobileCardEditorProps> = ({ cardId, onClose }) => {
  const { getCurrentDeviceCards, updateCard, deleteCard } = useStore();
  
  const cards = getCurrentDeviceCards();
  const card = cards.find(c => c.id === cardId);
  
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');
  const [title, setTitle] = useState(card?.title || '');
  const [description, setDescription] = useState(card?.description || '');
  const [url, setUrl] = useState(card?.url || '');
  const [backgroundColor, setBackgroundColor] = useState(card?.backgroundColor || '#6366f1');
  const [textColor, setTextColor] = useState(card?.textColor || '#ffffff');
  const [showColorPicker, setShowColorPicker] = useState<'bg' | 'text' | null>(null);
  
  if (!card) return null;
  
  const handleSave = () => {
    updateCard(cardId, {
      title,
      description,
      url,
      backgroundColor,
      textColor
    });
    onClose();
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      deleteCard(cardId);
      onClose();
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="bg-gray-900 rounded-t-3xl p-6 mt-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Edit Card</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-white"
          >
            <X size={20} />
          </motion.button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-lg">
          {[
            { id: 'content', label: 'Content', icon: Type },
            { id: 'style', label: 'Style', icon: Palette }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </motion.button>
          ))}
        </div>
        
        {/* Content */}
        <div className="mb-6">
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors text-white"
                  placeholder="Card Title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors resize-none text-white"
                  rows={3}
                  placeholder="Card Description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-white">URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors text-white"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          )}
          
          {activeTab === 'style' && (
            <div className="space-y-4">
              {/* Background Color */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Background Color</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowColorPicker(showColorPicker === 'bg' ? null : 'bg')}
                    className="w-12 h-12 rounded-lg border-2 border-white/20"
                    style={{ backgroundColor }}
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors text-white font-mono"
                  />
                </div>
                
                <AnimatePresence>
                  {showColorPicker === 'bg' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="mt-3"
                    >
                      <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Text Color */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Text Color</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')}
                    className="w-12 h-12 rounded-lg border-2 border-white/20"
                    style={{ backgroundColor: textColor }}
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors text-white font-mono"
                  />
                </div>
                
                <AnimatePresence>
                  {showColorPicker === 'text' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="mt-3"
                    >
                      <HexColorPicker color={textColor} onChange={setTextColor} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Color Presets */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Color Presets</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { bg: '#6366f1', text: '#ffffff' }, // Indigo
                    { bg: '#8b5cf6', text: '#ffffff' }, // Purple
                    { bg: '#ec4899', text: '#ffffff' }, // Pink
                    { bg: '#ef4444', text: '#ffffff' }, // Red
                    { bg: '#f97316', text: '#ffffff' }, // Orange
                    { bg: '#eab308', text: '#ffffff' }, // Yellow
                    { bg: '#22c55e', text: '#ffffff' }, // Green
                    { bg: '#06b6d4', text: '#ffffff' }, // Cyan
                  ].map((preset, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setBackgroundColor(preset.bg);
                        setTextColor(preset.text);
                      }}
                      className="aspect-square rounded-lg"
                      style={{ backgroundColor: preset.bg }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDelete}
            className="p-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            <Trash2 size={20} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium transition-all"
          >
            <Save size={18} />
            Save Changes
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};