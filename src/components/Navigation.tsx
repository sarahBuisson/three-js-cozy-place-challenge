import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

export function Navigation() {
  const location = useLocation()

  return (
    <nav className="navigation">
      <div className="nav-links">
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'active' : ''}
        >
          🐹 Capy Cinnamon Latte
        </Link>
        <Link 
          to="/demo" 
          className={location.pathname === '/demo' ? 'active' : ''}
        >
          🌊 Demo
        </Link>
      </div>
    </nav>
  )
}

export default Navigation
