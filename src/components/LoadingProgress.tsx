import { Html, useProgress } from '@react-three/drei'
import './LoadingProgress.css'

interface LoadingProgressProps {
  message?: string
  showPercentage?: boolean
  showItems?: boolean
}

/**
 * Composant Loading avec barre de progression
 * Utilise useProgress de drei pour suivre le chargement des assets
 */
export function LoadingProgress({ 
  message = 'Chargement',
  showPercentage = true,
  showItems = false
}: LoadingProgressProps = {}) {
  const { progress, active, loaded, total } = useProgress()

  return (
    <Html center>
      <div className="loading-progress-container">
        <div className="loading-progress-content">
          <div className="loading-progress-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          
          <h3 className="loading-progress-title">{active && message}</h3>
          
          {showPercentage && (
            <div className="loading-progress-percentage">
              {Math.round(progress)}%
            </div>
          )}
          
          <div className="loading-progress-bar">
            <div 
              className="loading-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {showItems && (
            <p className="loading-progress-items">
              {loaded} / {total} fichiers
            </p>
          )}
        </div>
      </div>
    </Html>
  )
}

export default LoadingProgress
