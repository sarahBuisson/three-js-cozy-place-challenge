import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface RipplePoint {
  x: number
  y: number
  intensity?: number  // Intensité de l'ondulation (0-1)
  frequency?: number  // Fréquence des cercles
}

interface RippleSurfaceProps {
  radius?: number
  segments?: number
  ripplePoints?: RipplePoint[]
  rippleSpeed?: number
  rippleAmplitude?: number
  rippleDecay?: number  // Vitesse de décroissance de l'onde
  color?: string
  position?: [number, number, number]
  rotation?: [number, number, number]
}

/**
 * Surface ronde avec ondulations circulaires autour de points
 * Simule l'effet de gouttes d'eau tombant dans l'eau
 */
export function RippleSurface({
  radius = 200,
  segments = 128,
  ripplePoints = [{ x: 0, y: 0 },{ x: 10, y: 10 }],
  rippleSpeed = 1,
  rippleAmplitude = 0.3,
  rippleDecay = 2,
  color = '#ffedcc',
  position = [0, -25, 0],
  rotation = [-Math.PI / 2, 0, 0]
}: RippleSurfaceProps = {}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  // Préparer les données des points pour le shader
  const rippleData = useMemo(() => {
    const maxPoints = 10
    const positions = new Float32Array(maxPoints * 2)
    const intensities = new Float32Array(maxPoints)
    const frequencies = new Float32Array(maxPoints)

    ripplePoints.forEach((point, i) => {
      if (i < maxPoints) {
        positions[i * 2] = point.x
        positions[i * 2 + 1] = point.y
        intensities[i] = point.intensity ?? 1.0
        frequencies[i] = point.frequency ?? 1.0
      }
    })

    return {
      positions,
      intensities,
      frequencies,
      count: Math.min(ripplePoints.length, maxPoints)
    }
  }, [ripplePoints])

  // Shader pour les ondulations circulaires
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uRadius: { value: radius },
        uRipplePoints: { value: rippleData.positions },
        uRippleIntensities: { value: rippleData.intensities },
        uRippleFrequencies: { value: rippleData.frequencies },
        uRippleCount: { value: rippleData.count },
        uRippleAmplitude: { value: rippleAmplitude },
        uRippleDecay: { value: rippleDecay },
        uColor: { value: new THREE.Color(color) },
        uLightPosition: { value: new THREE.Vector3(5, 5, 5) }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uRadius;
        uniform float uRipplePoints[20]; // 10 points * 2 (x, y)
        uniform float uRippleIntensities[10];
        uniform float uRippleFrequencies[10];
        uniform int uRippleCount;
        uniform float uRippleAmplitude;
        uniform float uRippleDecay;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vElevation;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          float totalElevation = 0.0;
          
          // Calculer l'ondulation pour chaque point
          for(int i = 0; i < 10; i++) {
            if(i >= uRippleCount) break;
            
            // Position du point d'ondulation
            vec2 rippleCenter = vec2(uRipplePoints[i * 2], uRipplePoints[i * 2 + 1]);
            
            // Distance du vertex au point d'ondulation
            float dist = distance(position.xy, rippleCenter);
            
            // Ondulation circulaire qui se propage
            float rippleFreq = uRippleFrequencies[i] * 5.0;
            float rippleIntensity = uRippleIntensities[i];
            
            // Fonction d'onde avec décroissance
            float wave = sin(dist * rippleFreq - uTime * 3.0) * rippleIntensity;
            
            // Décroissance exponentielle avec la distance
            float decay = exp(-dist * uRippleDecay);
            
            // Ajouter cette ondulation
            totalElevation += wave * decay * uRippleAmplitude;
          }
          
          vElevation = totalElevation;
          
          // Appliquer l'élévation
          vec3 newPosition = position + normal * totalElevation;
          
          // Atténuation vers les bords du cercle
          float edgeDist = abs(length(position.xy) - uRadius);
          float edgeFade = smoothstep(uRadius, uRadius * 0.9, length(position.xy));
          newPosition.z *= edgeFade;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uLightPosition;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vElevation;
        
        void main() {
          // Éclairage de base
          vec3 lightDir = normalize(uLightPosition - vPosition);
          float diff = max(dot(vNormal, lightDir), 0.0);
          
          // Lumière ambiante
          vec3 ambient = uColor * 0.4;
          
          // Lumière diffuse
          vec3 diffuse = uColor * diff * 0.6;
          
          // Effet de brillance basé sur l'élévation
          float shimmer = abs(vElevation) * 3.0;
          vec3 shimmerColor = vec3(1.0) * shimmer;
          
          // Reflets spéculaires
          vec3 viewDir = normalize(cameraPosition - vPosition);
          vec3 reflectDir = reflect(-lightDir, vNormal);
          float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
          vec3 specular = vec3(1.0) * spec * 0.5;
          
          // Couleur finale
          vec3 finalColor = ambient + diffuse + shimmerColor + specular;
          
          gl_FragColor = vec4(finalColor, 0.85);
        }
      `,
      transparent: true,
      opacity: 0.995,
      side: THREE.DoubleSide
    })
  }, [color, rippleAmplitude, rippleDecay, radius, rippleData])

  // Animation
  useFrame((state, delta) => {
    if (materialRef.current && state) {
      materialRef.current.uniforms.uTime.value += delta * rippleSpeed
    }
  })

  return (
    <mesh 
      ref={meshRef} 
      position={position} 
      rotation={rotation}
    >
      <circleGeometry args={[radius, segments]} />
      <primitive object={shaderMaterial} attach="material" ref={materialRef} />
    </mesh>
  )
}

export default RippleSurface
