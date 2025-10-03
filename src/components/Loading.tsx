import { Html } from '@react-three/drei'
import './Loading.css'

interface LoadingProps {
  message?: string
  size?: 'small' | 'medium' | 'large'
  variant?: 'spinner' | 'dots' | 'pulse'
}

/**
 * Composant Loading pour afficher pendant le chargement de modèles 3D
 * Utilise Html de drei pour afficher du contenu 2D dans une scène 3D
 */
export function Loading({ 
  message = 'Chargement...', 
  size = 'medium',
  variant = 'spinner'
}: LoadingProps = {}) {
  const sizeClass = `loading-${size}`
  
  return (
    <Html center>
      <div className={`loading-container ${sizeClass}`}>
        {variant === 'spinner' && (
          <div className="loading-spinner" />
        )}
        {variant === 'dots' && (
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        {variant === 'pulse' && (
          <div className="loading-pulse" />
        )}
        {message && <p className="loading-message">{message}</p>}
      </div>
    </Html>
  )
}

export default Loading
