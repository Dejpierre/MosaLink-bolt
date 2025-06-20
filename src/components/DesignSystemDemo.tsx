import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDesignSystem, popularColors } from '../design';
import { Palette, Copy, Check, Eye, Code } from 'lucide-react';

export const DesignSystemDemo: React.FC = () => {
  const { tokens, classes, styled } = useDesignSystem();
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'colors' | 'components' | 'tokens'>('colors');

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedColor(label);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const ColorPalette = ({ title, colors, prefix = '' }: { title: string; colors: any; prefix?: string }) => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {Object.entries(colors).map(([key, value]) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => copyToClipboard(value as string, `${prefix}${key}`)}
            className="group relative p-3 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-200"
            style={{ backgroundColor: value as string }}
          >
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              {copiedColor === `${prefix}${key}` ? (
                <Check size={16} className="text-white" />
              ) : (
                <Copy size={16} className="text-white" />
              )}
            </div>
            <div className="h-12"></div>
            <div className="mt-2 text-xs font-medium text-white bg-black/50 rounded px-2 py-1">
              {key}
            </div>
            <div className="text-xs text-white/80 bg-black/30 rounded px-1 mt-1 font-mono">
              {value as string}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const ComponentPreview = ({ title, children, code }: { title: string; children: React.ReactNode; code: string }) => (
    <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <button
          onClick={() => copyToClipboard(code, title)}
          className="flex items-center gap-2 px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          {copiedColor === title ? <Check size={14} /> : <Code size={14} />}
          {copiedColor === title ? 'Copié!' : 'Code'}
        </button>
      </div>
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        {children}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-6"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text mb-4">
          Design System
        </h1>
        <p className="text-gray-400 text-lg">
          Système de design centralisé pour une cohérence parfaite dans toute l'application.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 mb-8 p-1 bg-white/5 rounded-xl">
        {[
          { id: 'colors', label: 'Couleurs', icon: Palette },
          { id: 'components', label: 'Composants', icon: Eye },
          { id: 'tokens', label: 'Tokens', icon: Code }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-all ${
              activeSection === tab.id
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Contenu */}
      {activeSection === 'colors' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <ColorPalette title="Couleurs Principales" colors={tokens.colors.primary} prefix="primary." />
          <ColorPalette title="Couleurs Secondaires" colors={tokens.colors.secondary} prefix="secondary." />
          <ColorPalette title="Couleurs d'Accent" colors={tokens.colors.accent} prefix="accent." />
          <ColorPalette title="Couleurs Neutres" colors={tokens.colors.neutral} prefix="neutral." />
          <ColorPalette title="Couleurs Sociales" colors={popularColors.social} prefix="social." />
          <ColorPalette title="Couleurs de Marques" colors={popularColors.brands} prefix="brands." />
        </motion.div>
      )}

      {activeSection === 'components' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <ComponentPreview
            title="Boutons"
            code={`<button className="${classes.btnPrimary}">Bouton Principal</button>`}
          >
            <div className="flex gap-4 flex-wrap">
              <button className={classes.btnPrimary}>Bouton Principal</button>
              <button className={classes.btnSecondary}>Bouton Secondaire</button>
              <button className={classes.btnGhost}>Bouton Ghost</button>
            </div>
          </ComponentPreview>

          <ComponentPreview
            title="Cartes"
            code={`<div className="${classes.cardGlass} ${classes.cardHover}">Contenu de la carte</div>`}
          >
            <div className={`${classes.cardGlass} ${classes.cardHover} max-w-sm`}>
              <h4 className="text-lg font-semibold text-white mb-2">Titre de la carte</h4>
              <p className="text-gray-300">Contenu de la carte avec du texte d'exemple.</p>
            </div>
          </ComponentPreview>

          <ComponentPreview
            title="Inputs"
            code={`<input className="${classes.input}" placeholder="Votre texte..." />`}
          >
            <div className="space-y-4 max-w-md">
              <input className={classes.input} placeholder="Input standard" />
              <textarea className={classes.textarea} placeholder="Textarea" rows={3} />
            </div>
          </ComponentPreview>

          <ComponentPreview
            title="Texte avec Gradient"
            code={`<h2 className="${classes.textGradient}">Texte avec gradient</h2>`}
          >
            <h2 className={`${classes.textGradient} text-3xl font-bold`}>
              Texte avec gradient
            </h2>
          </ComponentPreview>
        </motion.div>
      )}

      {activeSection === 'tokens' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Espacements */}
            <div className={`${classes.cardGlass} p-6`}>
              <h3 className="text-lg font-semibold text-white mb-4">Espacements</h3>
              <div className="space-y-2">
                {Object.entries(tokens.spacing).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{key}</span>
                    <span className="text-white font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rayons de bordure */}
            <div className={`${classes.cardGlass} p-6`}>
              <h3 className="text-lg font-semibold text-white mb-4">Border Radius</h3>
              <div className="space-y-2">
                {Object.entries(tokens.borderRadius).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{key}</span>
                    <span className="text-white font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Typographie */}
            <div className={`${classes.cardGlass} p-6`}>
              <h3 className="text-lg font-semibold text-white mb-4">Typographie</h3>
              <div className="space-y-2">
                {Object.entries(tokens.typography.fontSize).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{key}</span>
                    <span className="text-white font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gradients */}
          <div className={`${classes.cardGlass} p-6`}>
            <h3 className="text-lg font-semibold text-white mb-4">Gradients</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(tokens.gradients).map(([category, gradients]) => (
                <div key={category}>
                  <h4 className="text-md font-medium text-gray-300 mb-2 capitalize">{category}</h4>
                  {typeof gradients === 'object' ? (
                    Object.entries(gradients).map(([key, gradient]) => (
                      <div key={key} className="mb-2">
                        <div
                          className="h-12 rounded-lg mb-1"
                          style={{ background: gradient as string }}
                        />
                        <div className="text-xs text-gray-400 font-mono">{key}</div>
                      </div>
                    ))
                  ) : (
                    <div className="mb-2">
                      <div
                        className="h-12 rounded-lg mb-1"
                        style={{ background: gradients as string }}
                      />
                      <div className="text-xs text-gray-400 font-mono">{category}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};