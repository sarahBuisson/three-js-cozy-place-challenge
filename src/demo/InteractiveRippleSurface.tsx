import { useState, useCallback } from 'react'
import { RippleSurface } from './RippleSurface'

interface InteractiveRippleSurfaceProps {
  radius?: number
  segments?: number
  maxRipples?: number
  rippleLifetime?: number  // Durée de vie d'une ondulation en secondes
  rippleSpeed?: number
  rippleAmplitude?: number
  color?: string
  position?: [number, number, number]
}

interface ActiveRipple {
  x: number
  y: number
  intensity: number
  createdAt: number
}

/**
 * Surface interactive - cliquez pour créer des ondulations
 */
export function InteractiveRippleSurface({
  radius = 5,
  segments = 128,
  maxRipples = 5,
  rippleLifetime = 3,
  rippleSpeed = 1,
  rippleAmplitude = 0.3,
  color = '#4a90e2',
  position = [0, 0, 0]
}: InteractiveRippleSurfaceProps = {}) {
  const [ripples, setRipples] = useState<ActiveRipple[]>([])

  // Ajouter une ondulation au clic
  const handleClick = useCallback((event: any) => {
    event.stopPropagation()
    
    // Position du clic dans l'espace local
    const point = event.point
    
    const newRipple: ActiveRipple = {
      x: point.x,
      y: point.z, // Le plan est horizontal
      intensity: 1,
      createdAt: Date.now()
    }

    setRipples(prev => {
      const updated = [...prev, newRipple]
      
      // Limiter le nombre d'ondulations
      if (updated.length > maxRipples) {
        return updated.slice(-maxRipples)
      }
      
      return updated
    })

    // Supprimer l'ondulation après sa durée de vie
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.createdAt !== newRipple.createdAt))
    }, rippleLifetime * 1000)
  }, [maxRipples, rippleLifetime])

  // Calculer l'intensité décroissante pour chaque ondulation
  const activeRipples = ripples.map(ripple => {
    const age = (Date.now() - ripple.createdAt) / 1000
    const intensity = Math.max(0, 1 - age / rippleLifetime)
    
    return {
      x: ripple.x,
      y: ripple.y,
      intensity
    }
  })

  return (
    <mesh 
      onClick={handleClick}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <RippleSurface
        radius={radius}
        segments={segments}
        ripplePoints={activeRipples}
        rippleSpeed={rippleSpeed}
        rippleAmplitude={rippleAmplitude}
        color={color}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />
    </mesh>
  )
}

export default InteractiveRippleSurface
