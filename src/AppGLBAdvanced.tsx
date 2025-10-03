import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { GLBModel } from './components/GLBModel'
import pumpkinModel from './assets/models/pumpkin.glb?url'
import { subtractBoxFromGeometry } from './utils/geometry-utils'
import './App.css'

function AppGLBAdvanced() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} shadows>

        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <Suspense fallback={null}>
          {/* Modèle original */}
          <GLBModel 
            modelPath={pumpkinModel} 
            position={[-2, 0, 0]}
            scale={0.8}
          />
          
          {/* Modèle avec découpe simple */}
          <GLBModel 
            modelPath={pumpkinModel} 
            position={[0, 0, 0]}
            scale={0.8}
            onGeometryLoad={(geometry) => {
              return subtractBoxFromGeometry(geometry, 0.3, 0.5)
            }}
          />
          
          {/* Modèle avec découpe et optimisation */}
          <GLBModel 
            modelPath={pumpkinModel} 
            position={[2, 0, 0]}
            scale={0.8}
            onGeometryLoad={(geometry) => {
              const cut = subtractBoxFromGeometry(geometry, 0.3, 0.5)
              cut.computeVertexNormals()
              return cut
            }}
          />
        </Suspense>
        
        {/* Sol pour voir les ombres */}
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -1, 0]} 
          receiveShadow
        >
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#808080" />
        </mesh>
        
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default AppGLBAdvanced
