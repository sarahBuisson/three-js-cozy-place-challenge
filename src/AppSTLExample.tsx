// Exemple de comparaison entre GLBModel et STLModel

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { STLModel } from './components/STLModel'
import stlModelPath from './assets/models/example.stl?url'
import './App.css'

/**
 * Exemple d'utilisation du composant STLModel
 * 
 * Ce composant est similaire à GLBModel mais conçu pour les fichiers STL.
 * Les fichiers STL ne contiennent que de la géométrie, pas de matériaux.
 */
function AppSTLExample() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        
        {/* Éclairage de la scène */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        {/* Contrôles de caméra */}
        <OrbitControls />

        <Suspense fallback={null}>
          {/* Modèle STL basique */}
          <STLModel
            modelPath={stlModelPath}
            position={[-2, 0, 0]}
            scale={1}
            color="#cccccc"
          />

          {/* Modèle STL avec matériau métallique */}
          <STLModel
            modelPath={stlModelPath}
            position={[0, 0, 0]}
            scale={1}
            color="#ff6600"
            metalness={0.8}
            roughness={0.2}
          />

          {/* Modèle STL avec rotation */}
          <STLModel
            modelPath={stlModelPath}
            position={[2, 0, 0]}
            scale={0.8}
            rotation={[0, Math.PI / 4, 0]}
            color="#0099ff"
            metalness={0.3}
            roughness={0.7}
          />
        </Suspense>

        {/* Grille pour référence */}
        <gridHelper args={[10, 10]} />
      </Canvas>
    </div>
  )
}

export default AppSTLExample
