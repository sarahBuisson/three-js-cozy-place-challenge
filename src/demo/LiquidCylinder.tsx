import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface LiquidCylinderProps {
  radius?: number
  height?: number
  radialSegments?: number
  heightSegments?: number
  color?: string
  waveAmplitude?: number
  waveFrequency?: number
  waveSpeed?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}

/**
 * Composant cylindre avec surface qui ondule comme un liquide
 */
export function LiquidCylinder({
  radius = 1,
  height = 2,
  radialSegments = 64,
  heightSegments = 32,
  color = '#4a90e2',
  waveAmplitude = 0.1,
  waveFrequency = 2,
  waveSpeed = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0]
}: LiquidCylinderProps = {}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  // Shader pour l'effet de liquide
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uWaveAmplitude: { value: waveAmplitude },
        uWaveFrequency: { value: waveFrequency },
        uColor: { value: new THREE.Color(color) },
        uLightPosition: { value: new THREE.Vector3(5, 5, 5) }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uWaveAmplitude;
        uniform float uWaveFrequency;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vWave;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          // Calculer l'ondulation avec plusieurs fréquences pour plus de réalisme
          float wave1 = sin(position.y * uWaveFrequency + uTime) * cos(position.x * uWaveFrequency + uTime);
          float wave2 = sin(position.y * uWaveFrequency * 0.7 - uTime * 0.8) * cos(position.z * uWaveFrequency * 0.7 - uTime * 0.8);
          float wave3 = sin(position.x * uWaveFrequency * 1.3 + uTime * 1.2) * sin(position.z * uWaveFrequency * 1.3 + uTime * 1.2);
          
          float wave = (wave1 + wave2 * 0.5 + wave3 * 0.3) * uWaveAmplitude;
          vWave = wave;
          
          // Appliquer l'ondulation dans la direction de la normale
          vec3 newPosition = position + normal * wave;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uLightPosition;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vWave;
        
        void main() {
          // Éclairage de base
          vec3 lightDir = normalize(uLightPosition - vPosition);
          float diff = max(dot(vNormal, lightDir), 0.0);
          
          // Lumière ambiante
          vec3 ambient = uColor * 0.3;
          
          // Lumière diffuse
          vec3 diffuse = uColor * diff * 0.7;
          
          // Effet de brillance basé sur l'ondulation
          float shimmer = abs(vWave) * 2.0;
          vec3 shimmerColor = vec3(1.0) * shimmer * 0.3;
          
          // Couleur finale
          vec3 finalColor = ambient + diffuse + shimmerColor;
          
          // Légère transparence sur les bords
          float edgeFactor = abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          float alpha = mix(0.8, 1.0, edgeFactor);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    })
  }, [color, waveAmplitude, waveFrequency])

  // Animation
  useFrame((state, delta) => {
    if (materialRef.current && state) {
      materialRef.current.uniforms.uTime.value += delta * waveSpeed
    }
  })

  return (
    <mesh 
      ref={meshRef} 
      position={position} 
      rotation={rotation}
    >
      <cylinderGeometry 
        args={[radius, radius, height, radialSegments, heightSegments]} 
      />
      <primitive object={shaderMaterial} attach="material" ref={materialRef} />
    </mesh>
  )
}

export default LiquidCylinder
