import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import NavBar from './components/NavBar'
import LoginPage from './pages/LoginPage'
import ListaPage from './pages/ListaPage'
import FormularioPage from './pages/FormularioPage'
import EditarPage from './pages/EditarPage'
import PrivateRoute from './routes/PrivateRoute'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {isAuthenticated && <NavBar />}
      <main className="flex-1">
        <Routes>
          {/* Ruta pública de login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ListaPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/nuevo"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <FormularioPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/editar/:id"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <EditarPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
