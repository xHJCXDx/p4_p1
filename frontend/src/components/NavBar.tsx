import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    closeMenu()
  }

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Titulo */}
          <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition">
            Gestión Participantes
          </Link>

          {/* Info del usuario + Botón Burger para mobile */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex items-center gap-3 text-sm">
                <span className="text-blue-200">👤 {user.username}</span>
                <span className={`px-3 py-1 rounded text-xs font-bold ${user.rol === 'ADMIN' ? 'bg-red-600' : 'bg-green-600'}`}>
                  {user.rol}
                </span>
              </div>
            )}

            {/* Botón Burger para mobile */}
            <button
              onClick={toggleMenu}
              className="md:hidden flex flex-col gap-1 p-2 hover:bg-blue-800 rounded transition"
              aria-label="Toggle menu"
            >
              <span className={`w-6 h-0.5 bg-white transition ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>

          {/* Menu Desktop */}
          {user && (
            <div className="hidden md:flex gap-4">
              <Link
                to="/"
                className="hover:text-blue-200 transition font-medium"
              >
                Listado
              </Link>
              {user.rol === 'ADMIN' && (
                <Link
                  to="/nuevo"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition font-medium"
                >
                  Nuevo Participante
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && user && (
          <div className="md:hidden mt-4 pb-4 border-t border-blue-800 pt-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-blue-200 mb-2">
              <span>👤 {user.username}</span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${user.rol === 'ADMIN' ? 'bg-red-600' : 'bg-green-600'}`}>
                {user.rol}
              </span>
            </div>
            <Link
              to="/"
              className="hover:text-blue-200 transition font-medium block py-2"
              onClick={closeMenu}
            >
              Listado de Participantes
            </Link>
            {user.rol === 'ADMIN' && (
              <Link
                to="/nuevo"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition font-medium block text-center"
                onClick={closeMenu}
              >
                Nuevo Participante
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition font-medium w-full text-center"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
