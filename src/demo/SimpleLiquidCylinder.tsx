import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SimpleLiquidCylinderProps {
  radius?: number
  height?: number
  segments?: number
  color?: string
  waveIntensity?: number
  waveSpeed?: number
  position?: [number, number, number]
}

/**
 * Version simplifiée du cylindre liquide sans shaders personnalisés
 * Utilise la modification directe de la géométrie
 */
export function SimpleLiquidCylinder({
  radius = 1,
  height = 2,
  segments = 32,
  color = '#4a90e2',
  waveIntensity = 0.1,
  waveSpeed = 1,
  position = [0, 0, 0]
}: SimpleLiquidCylinderProps = {}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)
  
  // Stocker les positions originales
  const originalPositions = useRef<Float32Array | null>(null)

  useFrame((state, delta) => {
    if (!meshRef.current&&state) return
    
    // @ts-ignore
    const geometry = meshRef.current.geometry as THREE.CylinderGeometry
    const positionAttribute = geometry.attributes.position
    
    // Sauvegarder les positions originales à la première frame
    if (!originalPositions.current) {
      originalPositions.current = new Float32Array(positionAttribute.array)
    }
    
    timeRef.current += delta * waveSpeed
    
    // Appliquer l'ondulation
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = originalPositions.current[i * 3]
      const y = originalPositions.current[i * 3 + 1]
      const z = originalPositions.current[i * 3 + 2]
      
      // Calculer l'ondulation basée sur la position
      const wave = Math.sin(y * 3 + timeRef.current) * 
                   Math.cos(x * 3 + timeRef.current * 0.7) * 
                   waveIntensity
      
      // Obtenir la normale pour déplacer le vertex dans la bonne direction
      const distance = Math.sqrt(x * x + z * z)
      if (distance > 0) {
        const normalizedX = x / distance
        const normalizedZ = z / distance
        
        positionAttribute.setXYZ(
          i,
          x + normalizedX * wave,
          y,
          z + normalizedZ * wave
        )
      }
    }
    
    positionAttribute.needsUpdate = true
    geometry.computeVertexNormals()
  })

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[radius, radius, height, segments, segments]} />
      <meshStandardMaterial 
        color={color}
        metalness={0.3}
        roughness={0.4}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

export default SimpleLiquidCylinder
