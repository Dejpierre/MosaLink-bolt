# Styles personnalisés

Ce dossier contient tous les fichiers CSS personnalisés pour le projet Bento Grid Editor.

## Structure des fichiers

- `custom.css` - Styles CSS personnalisés généraux
- `variables.css` - Variables CSS globales (couleurs, espacements, etc.)
- `animations.css` - Animations CSS personnalisées
- `index.ts` - Point d'entrée pour les styles, exporte des utilitaires et thèmes

## Comment utiliser

### Importer les styles

Les styles sont automatiquement importés dans `main.tsx`. Si vous créez de nouveaux fichiers CSS, vous devrez les importer manuellement :

```tsx
import './styles/custom.css';
import './styles/animations.css';
import './styles/variables.css';
```

### Utiliser les variables CSS

```css
.my-element {
  color: var(--primary);
  background-color: var(--background);
  border-radius: var(--radius);
  transition: all var(--transition);
}
```

### Utiliser les utilitaires TypeScript

```tsx
import { createGradient, theme, mixins } from './styles';

// Créer un dégradé
const buttonBackground = createGradient(theme.colors.primary, theme.colors.secondary);

// Utiliser les mixins
const containerStyle = {
  ...mixins.flexCenter,
  padding: theme.spacing.md,
  borderRadius: theme.borderRadius.lg,
};
```

### Utiliser les classes d'animation

```html
<div className="animate-float">Cet élément flotte</div>
<button className="animate-pulse">Ce bouton pulse</button>
<div className="animate-shine">Cet élément brille</div>
```

## Personnalisation

Vous pouvez modifier les variables CSS dans `variables.css` pour adapter l'apparence globale de l'application.

Pour ajouter de nouvelles animations, modifiez `animations.css` et ajoutez les keyframes et classes correspondantes.

Pour ajouter de nouveaux utilitaires ou thèmes, modifiez `index.ts`.