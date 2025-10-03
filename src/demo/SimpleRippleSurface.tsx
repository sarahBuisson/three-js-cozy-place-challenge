import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SimpleRippleSurfaceProps {
  radius?: number
  segments?: number
  ripplePoints?: Array<{ x: number; y: number }>
  rippleIntensity?: number
  rippleSpeed?: number
  color?: string
  position?: [number, number, number]
}

/**
 * Version simplifiée sans shaders - modifie directement la géométrie
 */
export function SimpleRippleSurface({
  radius = 5,
  segments = 64,
  ripplePoints = [{ x: 0, y: 0 }],
  rippleIntensity = 0.2,
  rippleSpeed = 1,
  color = '#4a90e2',
  position = [0, 0, 0]
}: SimpleRippleSurfaceProps = {}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)
  const originalPositions = useRef<Float32Array | null>(null)

  useFrame((state, delta) => {
    if (!meshRef.current||!state) return

    const geometry = meshRef.current.geometry as THREE.CircleGeometry
    const positionAttribute = geometry.attributes.position

    // Sauvegarder les positions originales
    if (!originalPositions.current) {
      originalPositions.current = new Float32Array(positionAttribute.array)
    }

    timeRef.current += delta * rippleSpeed

    // Appliquer les ondulations
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = originalPositions.current[i * 3]
      const y = originalPositions.current[i * 3 + 1]
      
      let totalElevation = 0

      // Pour chaque point d'ondulation
      ripplePoints.forEach(point => {
        const dx = x - point.x
        const dy = y - point.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        // Onde circulaire
        const wave = Math.sin(dist * 5 - timeRef.current * 3)
        const decay = Math.exp(-dist * 2) // Décroissance exponentielle
        
        totalElevation += wave * decay * rippleIntensity
      })

      positionAttribute.setZ(i, totalElevation)
    }

    positionAttribute.needsUpdate = true
    geometry.computeVertexNormals()
  })

  return (
    <mesh 
      ref={meshRef} 
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <circleGeometry args={[radius, segments]} />
      <meshStandardMaterial 
        color={color}
        metalness={0.3}
        roughness={0.4}
        transparent
        opacity={0.85}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default SimpleRippleSurface
