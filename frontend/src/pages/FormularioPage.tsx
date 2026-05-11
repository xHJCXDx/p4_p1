import { useNavigate } from 'react-router-dom'
import Formulario from '../components/Formulario'
import { useParticipantes } from '../context/ParticipantesContext'

export default function FormularioPage() {
  const navigate = useNavigate()
  const { agregar } = useParticipantes()

  const handleSuccess = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Nuevo Participante</h1>
          <p className="text-gray-600">Formulario para registrar un participante</p>
        </header>

        <section className="bg-white shadow-md rounded-lg p-6">
          <Formulario
            onAgregar={agregar}
            onSuccess={handleSuccess}
          />
        </section>
      </div>

      <footer className="mt-20 text-center text-gray-400 text-xs pb-10">&copy; 2026 - UTN Facultad Regional Mendoza</footer>
    </div>
  )
}
