import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { BoxGeometry } from 'three'
import { subtractBoxFromGeometry, subtractCustomBox, subtractMultipleBoxes } from '../utils/geometry-utils.ts'
import '../App.css'

function AppGeometryDemo() {
  // Créer différentes géométries avec découpes
  const createCutBox = () => {
    const geometry = new BoxGeometry(2, 3, 2)
    return subtractBoxFromGeometry(geometry, 0.3, 0.5)
  }

  const createMultipleCuts = () => {
    const geometry = new BoxGeometry(2, 3, 2)
    return subtractMultipleBoxes(geometry, [
      {heightPercentage: 0.15, heightPosition: 0.2},
      {heightPercentage: 0.15, heightPosition: 0.5},
      {heightPercentage: 0.15, heightPosition: 0.8}
    ])
  }

  const createCustomCut = () => {
    const geometry = new BoxGeometry(2, 3, 2)
    return subtractCustomBox(geometry, 0.5, 0.3, 0.5, 0.5)
  }

  const createSlot = () => {
    const geometry = new BoxGeometry(2, 3, 2)
    return subtractCustomBox(geometry, 1.0, 0.1, 0.3, 0.5)
  }

  const createStairs = () => {
    const geometry = new BoxGeometry(2, 3, 2)
    return subtractMultipleBoxes(geometry, [
      {heightPercentage: 0.08, heightPosition: 0.15},
      {heightPercentage: 0.08, heightPosition: 0.25},
      {heightPercentage: 0.08, heightPosition: 0.35},
      {heightPercentage: 0.08, heightPosition: 0.45},
      {heightPercentage: 0.08, heightPosition: 0.55},
      {heightPercentage: 0.08, heightPosition: 0.65},
      {heightPercentage: 0.08, heightPosition: 0.75}
    ])
  }

  return (
      <div style={{width: '100vw', height: '100vh'}}>
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '15px',
          borderRadius: '5px',
          fontFamily: 'monospace',
          fontSize: '14px',
          zIndex: 1
        }}>
          <h3 style={{margin: '0 0 10px 0'}}>🔧 Démonstration geometry-utils</h3>
          <div>Utilisez la souris pour explorer les modèles</div>
          <div style={{marginTop: '10px', fontSize: '12px'}}>
            • Boîte originale (gauche)<br/>
            • Découpe simple 30% (centre-gauche)<br/>
            • 3 découpes multiples (centre)<br/>
            • Découpe personnalisée (centre-droite)<br/>
            • Fente horizontale (droite)
          </div>
        </div>

        <Canvas camera={{position: [8, 6, 8], fov: 50}} shadows>
          <ambientLight intensity={0.5}/>
          <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, 5, -5]} intensity={0.5}/>

          {/* Boîte originale (référence) */}
          <mesh position={[-8, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[2, 3, 2]}/>
            <meshStandardMaterial color="#4a90e2" metalness={0.3} roughness={0.7}/>
          </mesh>

          {/* Boîte avec découpe simple */}
          <mesh position={[-4, 0, 0]} geometry={createCutBox()} castShadow receiveShadow>
            <meshStandardMaterial color="#e74c3c" metalness={0.3} roughness={0.7}/>
          </mesh>

          {/* Boîte avec découpes multiples */}
          <mesh position={[0, 0, 0]} geometry={createMultipleCuts()} castShadow receiveShadow>
            <meshStandardMaterial color="#2ecc71" metalness={0.3} roughness={0.7}/>
          </mesh>

          {/* Boîte avec découpe personnalisée */}
          <mesh position={[4, 0, 0]} geometry={createCustomCut()} castShadow receiveShadow>
            <meshStandardMaterial color="#f39c12" metalness={0.3} roughness={0.7}/>
          </mesh>

          {/* Boîte avec fente */}
          <mesh position={[8, 0, 0]} geometry={createSlot()} castShadow receiveShadow>
            <meshStandardMaterial color="#9b59b6" metalness={0.3} roughness={0.7}/>
          </mesh>

          {/* Rangée du bas - Exemples avancés */}

          {/* Boîte avec effet escalier */}
          <mesh position={[-6, 0, -4]} geometry={createStairs()} castShadow receiveShadow>
            <meshStandardMaterial color="#1abc9c" metalness={0.5} roughness={0.5}/>
          </mesh>

          {/* Boîte avec découpe en haut */}
          <mesh position={[-2, 0, -4]} castShadow receiveShadow>
            <bufferGeometry attach="geometry" {...subtractBoxFromGeometry(new BoxGeometry(2, 3, 2), 0.2, 0.85)} />
            <meshStandardMaterial color="#e67e22" metalness={0.3} roughness={0.7}/>
          </mesh>

          {/* Boîte avec découpe en bas */}
          <mesh position={[2, 0, -4]} castShadow receiveShadow>
            <bufferGeometry attach="geometry" {...subtractBoxFromGeometry(new BoxGeometry(2, 3, 2), 0.2, 0.15)} />
            <meshStandardMaterial color="#3498db" metalness={0.3} roughness={0.7}/>
          </mesh>

          {/* Boîte avec découpe large */}
          <mesh position={[6, 0, -4]} castShadow receiveShadow>
            <bufferGeometry attach="geometry" {...subtractCustomBox(new BoxGeometry(2, 3, 2), 0.8, 0.4, 0.8, 0.5)} />
            <meshStandardMaterial color="#e91e63" metalness={0.3} roughness={0.7}/>
          </mesh>

          {/* Sol */}
          <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -2, 0]}
              receiveShadow
          >
            <planeGeometry args={[30, 20]}/>
            <meshStandardMaterial color="#34495e"/>
          </mesh>

          <OrbitControls
              target={[0, 0, -2]}
              enableDamping
              dampingFactor={0.05}
          />

          {/* Grille pour référence */}
          <gridHelper args={[30, 30, '#666666', '#444444']} position={[0, -1.99, 0]}/>
        </Canvas>
      </div>
  )
}

export default AppGeometryDemo
