import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { LayoutTemplate, TemplateCategory } from '../types';
import { 
  Save, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  Star, 
  Heart, 
  Eye, 
  Trash2, 
  Edit3, 
  Copy,
  Plus,
  Grid,
  User,
  Briefcase,
  Palette,
  Camera,
  Utensils,
  Tag,
  Calendar,
  TrendingUp,
  Check,
  X
} from 'lucide-react';
import { nanoid } from 'nanoid';

interface TemplateManagerProps {
  onClose?: () => void;
}

const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: 'all',
    name: 'Tous',
    description: 'Tous les templates disponibles',
    icon: 'grid',
    color: 'from-gray-500 to-gray-600'
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Templates professionnels',
    icon: 'briefcase',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'personal',
    name: 'Personnel',
    description: 'Templates pour usage personnel',
    icon: 'user',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'creative',
    name: 'Créatif',
    description: 'Templates artistiques',
    icon: 'palette',
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Templates pour portfolios',
    icon: 'camera',
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Templates pour restaurants',
    icon: 'utensils',
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'custom',
    name: 'Mes Templates',
    description: 'Vos templates personnalisés',
    icon: 'star',
    color: 'from-indigo-500 to-purple-600'
  }
];

const PREDEFINED_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'restaurant-complete',
    name: 'Restaurant Complet',
    description: 'Template complet pour restaurant avec menu, réservation et galerie',
    category: 'restaurant',
    tags: ['restaurant', 'menu', 'réservation', 'galerie'],
    cards: [
      {
        title: 'Bienvenue Chez Nous',
        description: 'Découvrez une cuisine authentique dans un cadre chaleureux',
        url: '/about',
        backgroundColor: '#2d3748',
        textColor: '#ffffff',
        size: '4x2',
        icon: 'utensils',
        backgroundImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        title: 'Notre Menu',
        description: 'Découvrez nos spécialités',
        url: '/menu',
        backgroundColor: '#f7fafc',
        textColor: '#2d3748',
        size: '2x2',
        icon: 'book-open'
      },
      {
        title: 'Réserver',
        description: 'Réservez votre table',
        url: '/reservation',
        backgroundColor: '#065f46',
        textColor: '#ffffff',
        size: '2x1',
        icon: 'calendar'
      },
      {
        title: 'Nos Vins',
        description: 'Cave exceptionnelle',
        url: '/wines',
        backgroundColor: '#742a2a',
        textColor: '#ffffff',
        size: '2x1',
        icon: 'wine'
      },
      {
        title: 'Contact',
        description: 'Nous trouver',
        url: '/contact',
        backgroundColor: '#7c2d12',
        textColor: '#ffffff',
        size: '2x1',
        icon: 'map-pin'
      },
      {
        title: 'Instagram',
        description: 'Suivez-nous',
        url: 'https://instagram.com',
        backgroundColor: '#e4405f',
        textColor: '#ffffff',
        size: '2x1',
        icon: 'instagram'
      }
    ],
    profile: {
      firstName: 'Restaurant',
      lastName: 'Le Gourmet',
      bio: 'Cuisine française traditionnelle dans un cadre moderne. Venez découvrir nos spécialités préparées avec des produits frais et locaux.',
      profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Paris, France',
      website: 'https://restaurant-legourmet.fr'
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    isCustom: false,
    author: 'Mosalink',
    usageCount: 156
  },
  {
    id: 'portfolio-creative',
    name: 'Portfolio Créatif',
    description: 'Template moderne pour artistes et créatifs',
    category: 'portfolio',
    tags: ['portfolio', 'créatif', 'artiste', 'moderne'],
    cards: [
      {
        title: 'Mon Travail',
        description: 'Découvrez mes créations et projets récents',
        url: '/portfolio',
        backgroundColor: '#1e1b4b',
        textColor: '#ffffff',
        size: '3x2',
        icon: 'camera',
        backgroundImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        title: 'À Propos',
        description: 'Mon parcours',
        url: '/about',
        backgroundColor: '#4c1d95',
        textColor: '#ffffff',
        size: '2x1',
        icon: 'user'
      },
      {
        title: 'Services',
        description: 'Ce que je propose',
        url: '/services',
        backgroundColor: '#7c3aed',
        textColor: '#ffffff',
        size: '2x1',
        icon: 'briefcase'
      },
      {
        title: 'Contact',
        description: 'Travaillons ensemble',
        url: '/contact',
        backgroundColor: '#ec4899',
        textColor: '#ffffff',
        size: '2x2',
        icon: 'mail'
      },
      {
        title: 'Blog',
        description: 'Mes réflexions',
        url: '/blog',
        backgroundColor: '#f97316',
        textColor: '#ffffff',
        size: '2x1',
        icon: 'book'
      }
    ],
    profile: {
      firstName: 'Alex',
      lastName: 'Creative',
      bio: 'Designer graphique et photographe passionné. Je crée des expériences visuelles uniques qui racontent des histoires.',
      profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Lyon, France',
      website: 'https://alexcreative.com'
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    isCustom: false,
    author: 'Mosalink',
    usageCount: 89
  },
  {
    id: 'business-pro',
    name: 'Business Pro',
    description: 'Template professionnel pour entreprises',
    category: 'business',
    tags: ['business', 'professionnel', 'entreprise', 'corporate'],
    cards: [
      {
        title: 'Notre Entreprise',
        description: 'Leader dans notre domaine depuis 15 ans',
        url: '/company',
        backgroundColor: '#1e40af',
        textColor: '#ffffff',
        size: '3x2',
        icon: 'briefcase'
      },
      {
        title: 'Services',
        description: 'Solutions sur mesure',
        url: '/services',
        backgroundColor: '#059669',
        textColor: '#ffffff',
        size: '2x1',
        icon: 'settings'
      },
      {
        title: 'Équipe',
        description: 'Nos experts',
        url: '/team',
        backgroundColor: '#7c2d12',
        textColor: '#ffffff',
        size: '2x1',
        icon: 'users'
      },
      {
        title: 'Contact',
        description: 'Parlons de votre projet',
        url: '/contact',
        backgroundColor: '#dc2626',
        textColor: '#ffffff',
        size: '2x2',
        icon: 'phone'
      },
      {
        title: 'Blog',
        description: 'Actualités & insights',
        url: '/blog',
        backgroundColor: '#7c3aed',
        textColor: '#ffffff',
        size: '2x1',
        icon: 'book'
      }
    ],
    profile: {
      firstName: 'Entreprise',
      lastName: 'Solutions Pro',
      bio: 'Nous accompagnons les entreprises dans leur transformation digitale avec des solutions innovantes et sur mesure.',
      profileImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Paris, France',
      website: 'https://solutionspro.com'
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    isCustom: false,
    author: 'Mosalink',
    usageCount: 234
  }
];

export const TemplateManager: React.FC<TemplateManagerProps> = ({ onClose }) => {
  const { getCurrentDeviceCards, profile, importData, exportData } = useStore();
  
  const cards = getCurrentDeviceCards();
  const [customTemplates, setCustomTemplates] = useState<LayoutTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveForm, setSaveForm] = useState({
    name: '',
    description: '',
    category: 'custom' as LayoutTemplate['category'],
    tags: ''
  });

  // Charger les templates personnalisés depuis le localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mosalink-custom-templates');
    if (saved) {
      try {
        const templates = JSON.parse(saved);
        setCustomTemplates(templates);
      } catch (error) {
        console.error('Erreur lors du chargement des templates:', error);
      }
    }
  }, []);

  // Sauvegarder les templates personnalisés
  const saveCustomTemplates = (templates: LayoutTemplate[]) => {
    localStorage.setItem('mosalink-custom-templates', JSON.stringify(templates));
    setCustomTemplates(templates);
  };

  // Combiner tous les templates
  const allTemplates = [...PREDEFINED_TEMPLATES, ...customTemplates];

  // Filtrer les templates
  const filteredTemplates = allTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Sauvegarder la configuration actuelle comme template
  const handleSaveCurrentLayout = () => {
    if (!saveForm.name.trim()) {
      alert('Veuillez entrer un nom pour le template');
      return;
    }

    const newTemplate: LayoutTemplate = {
      id: nanoid(),
      name: saveForm.name.trim(),
      description: saveForm.description.trim() || 'Template personnalisé',
      category: saveForm.category,
      tags: saveForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      cards: cards.map(({ id, order, ...card }) => card),
      profile: { ...profile },
      createdAt: new Date(),
      updatedAt: new Date(),
      isCustom: true,
      author: `${profile.firstName} ${profile.lastName}`,
      usageCount: 0
    };

    const updatedTemplates = [...customTemplates, newTemplate];
    saveCustomTemplates(updatedTemplates);
    
    setShowSaveDialog(false);
    setSaveForm({ name: '', description: '', category: 'custom', tags: '' });
    
    alert('✅ Template sauvegardé avec succès !');
  };

  // Charger un template
  const handleLoadTemplate = (template: LayoutTemplate) => {
    if (window.confirm(`Charger le template "${template.name}" ? Cela remplacera votre configuration actuelle.`)) {
      const templateData = {
        cards: template.cards.map((card, index) => ({
          ...card,
          id: nanoid(),
          order: index
        })),
        profile: template.profile || profile
      };
      
      importData(JSON.stringify(templateData));
      
      // Incrémenter le compteur d'utilisation
      if (template.isCustom) {
        const updatedTemplates = customTemplates.map(t => 
          t.id === template.id 
            ? { ...t, usageCount: (t.usageCount || 0) + 1, updatedAt: new Date() }
            : t
        );
        saveCustomTemplates(updatedTemplates);
      }
      
      if (onClose) onClose();
    }
  };

  // Supprimer un template personnalisé
  const handleDeleteTemplate = (templateId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      const updatedTemplates = customTemplates.filter(t => t.id !== templateId);
      saveCustomTemplates(updatedTemplates);
    }
  };

  // Dupliquer un template
  const handleDuplicateTemplate = (template: LayoutTemplate) => {
    const duplicatedTemplate: LayoutTemplate = {
      ...template,
      id: nanoid(),
      name: `${template.name} (Copie)`,
      isCustom: true,
      author: `${profile.firstName} ${profile.lastName}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0
    };

    const updatedTemplates = [...customTemplates, duplicatedTemplate];
    saveCustomTemplates(updatedTemplates);
  };

  const getCategoryIcon = (iconName: string) => {
    const icons = {
      grid: Grid,
      briefcase: Briefcase,
      user: User,
      palette: Palette,
      camera: Camera,
      utensils: Utensils,
      star: Star
    };
    return icons[iconName as keyof typeof icons] || Grid;
  };

  const renderTemplateCard = (template: LayoutTemplate) => {
    return (
      <motion.div
        key={template.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.02 }}
        className="group relative p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-indigo-300 transition-colors">
              {template.name}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
              {template.description}
            </p>
          </div>
          
          {template.isCustom && (
            <div className="flex items-center gap-1 ml-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicateTemplate(template);
                }}
                className="p-1 rounded bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 transition-colors"
                title="Dupliquer"
              >
                <Copy size={14} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTemplate(template.id);
                }}
                className="p-1 rounded bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"
                title="Supprimer"
              >
                <Trash2 size={14} />
              </motion.button>
            </div>
          )}
        </div>

        {/* Métadonnées */}
        <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Grid size={12} />
            <span>{template.cards.length} cartes</span>
          </div>
          <div className="flex items-center gap-1">
            <User size={12} />
            <span>{template.author || 'Mosalink'}</span>
          </div>
          {template.usageCount !== undefined && (
            <div className="flex items-center gap-1">
              <TrendingUp size={12} />
              <span>{template.usageCount} utilisations</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {template.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300"
              >
                {tag}
              </span>
            ))}
            {template.tags.length > 3 && (
              <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-400">
                +{template.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Aperçu des cartes */}
        <div className="grid grid-cols-4 gap-1 mb-4 h-16 overflow-hidden">
          {template.cards.slice(0, 8).map((card, index) => (
            <div
              key={index}
              className="rounded bg-gradient-to-br opacity-60 group-hover:opacity-80 transition-opacity"
              style={{
                background: `linear-gradient(135deg, ${card.backgroundColor}, ${card.backgroundColor}dd)`
              }}
            />
          ))}
        </div>

        {/* Bouton de chargement */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleLoadTemplate(template)}
          className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2"
        >
          <Download size={16} />
          Utiliser ce template
        </motion.button>

        {/* Badge custom */}
        {template.isCustom && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs text-indigo-400 font-medium">
            Personnalisé
          </div>
        )}
      </motion.div>
    );
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
        className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Gestionnaire de Templates
            </h2>
            <p className="text-gray-400 mt-1">
              Sauvegardez et réutilisez vos mises en page favorites
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg text-white font-medium transition-all"
            >
              <Save size={16} />
              Sauvegarder
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un template..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:border-white/40 focus:outline-none transition-colors"
              />
            </div>

            {/* Catégories */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {TEMPLATE_CATEGORIES.map((category) => {
                const IconComponent = getCategoryIcon(category.icon);
                return (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                      selectedCategory === category.id
                        ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                        : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    <IconComponent size={16} />
                    {category.name}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Liste des templates */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(renderTemplateCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-gradient-to-br from-gray-500/20 to-gray-600/20 flex items-center justify-center">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Aucun template trouvé</h3>
              <p className="text-gray-400">
                {searchQuery 
                  ? `Aucun template ne correspond à "${searchQuery}"`
                  : 'Aucun template dans cette catégorie'
                }
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Dialog de sauvegarde */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Sauvegarder comme template</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom du template *
                  </label>
                  <input
                    type="text"
                    value={saveForm.name}
                    onChange={(e) => setSaveForm({ ...saveForm, name: e.target.value })}
                    placeholder="Mon super template"
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:border-white/40 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={saveForm.description}
                    onChange={(e) => setSaveForm({ ...saveForm, description: e.target.value })}
                    placeholder="Description de votre template..."
                    rows={3}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:border-white/40 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={saveForm.category}
                    onChange={(e) => setSaveForm({ ...saveForm, category: e.target.value as any })}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none transition-colors"
                  >
                    {TEMPLATE_CATEGORIES.filter(cat => cat.id !== 'all').map((category) => (
                      <option key={category.id} value={category.id} className="bg-gray-800">
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={saveForm.tags}
                    onChange={(e) => setSaveForm({ ...saveForm, tags: e.target.value })}
                    placeholder="moderne, élégant, business"
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:border-white/40 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
                >
                  Annuler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveCurrentLayout}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  Sauvegarder
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};