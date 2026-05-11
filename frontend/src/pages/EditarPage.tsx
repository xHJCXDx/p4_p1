import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Formulario from '../components/Formulario'
import { useParticipantes } from '../context/ParticipantesContext'

export default function EditarPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { participantes, editar, seleccionar, participanteSeleccionado } = useParticipantes()

  useEffect(() => {
    if (id) {
      const participante = participantes.find(p => p.id === Number(id))
      if (participante) {
        seleccionar(participante)
      } else {
        navigate('/')
      }
    }
  }, [id, participantes, seleccionar, navigate])

  const handleSuccess = () => {
    seleccionar(null)
    navigate('/')
  }

  if (!participanteSeleccionado) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Editar Participante</h1>
          <p className="text-gray-600">Modifica los datos del participante: {participanteSeleccionado.nombre}</p>
        </header>

        <section className="bg-white shadow-md rounded-lg p-6">
          <Formulario
            onEditar={editar}
            participanteActual={participanteSeleccionado}
            onSuccess={handleSuccess}
          />
        </section>
      </div>

      <footer className="mt-20 text-center text-gray-400 text-xs pb-10">&copy; 2026 - UTN Facultad Regional Mendoza</footer>
    </div>
  )
}
