# 🎮 Demo Components

Ce dossier contient tous les composants de démonstration et d'expérimentation.

## 📁 Structure

```
src/demo/
├── index.ts                      # Exports des composants demo
├── LiquidCylinder.tsx            # Cylindre avec effet liquide
├── SimpleLiquidCylinder.tsx      # Version simple du cylindre liquide
├── RippleSurface.tsx             # Surface avec ondulations (shader)
├── SimpleRippleSurface.tsx       # Surface ondulante (géométrie)
└── InteractiveRippleSurface.tsx  # Surface interactive au clic
```

## 🎨 Composants disponibles

### LiquidCylinder
Cylindre avec surface qui ondule comme un liquide.

**Props:**
- `position` - Position du cylindre
- `radius` - Rayon du cylindre
- `height` - Hauteur du cylindre
- `color` - Couleur du liquide

**Exemple:**
```tsx
import { LiquidCylinder } from './demo'

<LiquidCylinder 
  position={[0, 0, 0]} 
  radius={2} 
  height={4} 
  color="#4FC3F7" 
/>
```

### SimpleLiquidCylinder
Version simplifiée du cylindre liquide avec moins de détails mais meilleures performances.

**Exemple:**
```tsx
import { SimpleLiquidCylinder } from './demo'

<SimpleLiquidCylinder position={[0, 0, 0]} />
```

### RippleSurface
Surface circulaire avec ondulations en cercles concentriques autour de points.
Utilise des shaders pour de meilleures performances.

**Props:**
- `ripplePoints` - Array de points `{x, y}` sources d'ondulations
- `radius` - Rayon de la surface
- `segments` - Nombre de segments (détail)
- `amplitude` - Amplitude des ondulations
- `frequency` - Fréquence des ondulations
- `speed` - Vitesse des ondulations

**Exemple:**
```tsx
import { RippleSurface } from './demo'

<RippleSurface 
  ripplePoints={[
    { x: 0, y: 0 },
    { x: 2, y: 2 }
  ]}
  radius={5}
  amplitude={0.3}
  speed={1}
/>
```

### SimpleRippleSurface
Version sans shader de la surface ondulante. Modifie directement la géométrie.

**Exemple:**
```tsx
import { SimpleRippleSurface } from './demo'

<SimpleRippleSurface 
  ripplePoints={[{ x: 0, y: 0 }]}
  radius={5}
/>
```

### InteractiveRippleSurface
Surface interactive qui crée des ondulations au clic de la souris.

**Props:**
- `radius` - Rayon de la surface
- `maxRipples` - Nombre maximum d'ondulations simultanées
- `amplitude` - Amplitude des ondulations
- `speed` - Vitesse des ondulations

**Exemple:**
```tsx
import { InteractiveRippleSurface } from './demo'

<InteractiveRippleSurface 
  radius={5}
  maxRipples={5}
  amplitude={0.5}
  speed={1.5}
/>
```

## 🚀 Utilisation

### Import depuis le dossier demo

```tsx
// Import tous les composants
import { 
  LiquidCylinder, 
  RippleSurface, 
  InteractiveRippleSurface 
} from './demo'

// Ou import individuel
import { RippleSurface } from './demo/RippleSurface'
```

### Exemple complet

```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { RippleSurface, LiquidCylinder } from './demo'

function MyScene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      <RippleSurface 
        ripplePoints={[{ x: 0, y: 0 }]}
        radius={5}
        amplitude={0.3}
      />
      
      <LiquidCylinder 
        position={[3, 0, 0]}
        radius={1}
        height={3}
      />
      
      <OrbitControls />
    </Canvas>
  )
}
```

## 📝 Conventions

### Nommage
- Les composants de démo doivent avoir un nom descriptif
- Préfixer avec `Simple` pour les versions sans shader/optimisées
- Préfixer avec `Interactive` pour les versions interactives

### Props
- Utiliser des valeurs par défaut raisonnables
- Documenter toutes les props
- Typer avec TypeScript

### Performance
- Préférer les shaders pour les animations complexes
- Fournir une version `Simple` si nécessaire
- Utiliser `useMemo` et `useCallback` quand approprié

## 🎯 Ajouter un nouveau composant demo

1. Créer le fichier dans `src/demo/`
```tsx
// src/demo/MyNewDemo.tsx
export function MyNewDemo() {
  return <mesh>...</mesh>
}
```

2. Ajouter l'export dans `index.ts`
```tsx
export { MyNewDemo } from './MyNewDemo'
```

3. Documenter dans ce README

4. Utiliser dans `AppRippleDemo.tsx` ou créer une nouvelle page demo

## 🧪 Testing des démos

Accédez à la page demo :
- **Local**: `http://localhost:5173/demo`
- **Production**: `https://[username].github.io/capy-cinnamon-latte/demo`

## 📚 Ressources

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [React Three Drei](https://github.com/pmndrs/drei)
- [GLSL Shaders](https://www.khronos.org/opengl/wiki/Core_Language_(GLSL))

## 🎨 Idées de futurs composants

- [ ] Particules interactives
- [ ] Effet de vent sur herbe
- [ ] Vagues océan réalistes
- [ ] Système de fumée/brouillard
- [ ] Déformations mesh avec bruit Perlin
- [ ] Transitions morphing entre formes
- [ ] Effet de feu avec shaders
- [ ] Fluides simulés
