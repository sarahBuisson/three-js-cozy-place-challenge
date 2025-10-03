import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

interface Loading3DProps {
  variant?: 'cube' | 'sphere' | 'torus'
  color?: string
  size?: number
}

/**
 * Composant Loading 3D qui affiche une forme qui tourne dans la scène
 */
export function Loading3D({ 
  variant = 'cube',
  color = '#3b82f6',
  size = 1
}: Loading3DProps = {}) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta
      meshRef.current.rotation.y += delta * 0.5
      // Effet de pulsation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      meshRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <mesh ref={meshRef}>
      {variant === 'cube' && <boxGeometry args={[size, size, size]} />}
      {variant === 'sphere' && <sphereGeometry args={[size * 0.5, 32, 32]} />}
      {variant === 'torus' && <torusGeometry args={[size * 0.5, size * 0.2, 16, 32]} />}
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

export default Loading3D
