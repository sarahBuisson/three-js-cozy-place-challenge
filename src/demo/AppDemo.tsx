import { useState } from 'react'
import AppGLBAdvanced from '../AppGLBAdvanced'
import AppGeometryDemo from './AppGeometryDemo'
import '../App.css'

type DemoType = 'ripple' | 'liquid' | 'loading' | 'glb' | 'geometry'

interface DemoInfo {
  id: DemoType
  title: string
  description: string
  component: React.ComponentType
}

const demos: DemoInfo[] = [
  {
    id: 'glb',
    title: '🎃 GLB Model Advanced',
    description: 'Chargement et modification de modèles GLB',
    component: AppGLBAdvanced
  },
  {
    id: 'geometry',
    title: '📦 Geometry Utils',
    description: 'Opérations booléennes sur les géométries',
    component: AppGeometryDemo
  }
]

function AppDemo() {
  const [currentDemo, setCurrentDemo] = useState<DemoType>('ripple')

  const CurrentDemoComponent = demos.find(d => d.id === currentDemo)?.component

  return (
      <div style={{width: '100vw', height: '100vh', position: 'relative'}}>
        {/* Menu de sélection des démos */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: '15px',
          overflowX: 'auto'
        }}>
          <h2 style={{
            margin: 0,
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            marginRight: '20px'
          }}>
            🎨 Cozy Three Demos
          </h2>

          {demos.map(demo => (
              <button
                  key={demo.id}
                  onClick={() => setCurrentDemo(demo.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: currentDemo === demo.id
                        ? 'rgba(255, 255, 255, 0.3)'
                        : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: currentDemo === demo.id ? 'bold' : 'normal',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    backdropFilter: 'blur(10px)',
                    boxShadow: currentDemo === demo.id
                        ? '0 2px 8px rgba(0,0,0,0.2)'
                        : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (currentDemo !== demo.id) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentDemo !== demo.id) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                  title={demo.description}
              >
                {demo.title}
              </button>
          ))}
        </div>

        {/* Info de la démo actuelle */}
        <div style={{
          position: 'fixed',
          top: '70px',
          left: '20px',
          zIndex: 999,
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '15px 20px',
          borderRadius: '10px',
          color: 'white',
          fontFamily: 'monospace',
          maxWidth: '400px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{margin: '0 0 8px 0', fontSize: '16px'}}>
            {demos.find(d => d.id === currentDemo)?.title}
          </h3>
          <p style={{margin: 0, fontSize: '13px', color: '#aaa'}}>
            {demos.find(d => d.id === currentDemo)?.description}
          </p>
        </div>

        {/* Rendu de la démo actuelle */}
        <div style={{
          width: '100%',
          height: '100%',
          paddingTop: '60px'
        }}>
          {CurrentDemoComponent && <CurrentDemoComponent/>}
        </div>
      </div>
  )
}

export default AppDemo
