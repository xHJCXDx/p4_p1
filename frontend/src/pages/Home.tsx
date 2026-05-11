import React, { useState, useMemo } from 'react'
import Formulario from '../components/Formulario'
import ParticipanteCard from '../components/ParticipanteCard'
import Filtros, { type FiltrosData } from '../components/Filtros'
import { useParticipantes } from '../context/ParticipantesContext'
import type { Participante } from '../models/Participante'

const Home: React.FC = () => {
  const { participantes, agregar, editar, resetear } = useParticipantes()

  const [filtros, setFiltros] = useState<FiltrosData>({
    nombre: '',
    modalidad: 'Todas',
    nivel: 'Todos',
  })

  const [participanteActual, setParticipanteActual] = useState<Participante | null>(null)

  const limpiarFiltros = () => {
    setFiltros({
      nombre: '',
      modalidad: 'Todas',
      nivel: 'Todos',
    })
  }

  const handleLimpiarEdicion = () => {
    setParticipanteActual(null)
  }

  // Lógica de estado derivado (Filtros combinados con AND lógico)
  const participantesFiltrados = useMemo(() => {
    return participantes.filter((p) => {
      const cumpleNombre = p.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
      const cumpleModalidad = filtros.modalidad === 'Todas' || p.modalidad === filtros.modalidad
      const cumpleNivel = filtros.nivel === 'Todos' || p.nivel === filtros.nivel

      return cumpleNombre && cumpleModalidad && cumpleNivel
    })
  }, [participantes, filtros])

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Gestión de Participantes API REST</h1>
          <p className="text-gray-600">Trabajo Práctico N° 5 - useReducer + Context</p>

          <div className="mt-6 flex flex-col items-center gap-4">
            <button
              onClick={resetear}
              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-200 transition border border-red-200"
            >
              Resetear datos (Base de Datos)
            </button>

            <div className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-full font-bold shadow-lg">
              Mostrando {participantesFiltrados.length} de {participantes.length} participantes
            </div>
          </div>
        </header>

        <section className="mb-10">
          <Formulario
            onAgregar={agregar}
            onEditar={editar}
            participanteActual={participanteActual}
            onLimpiarEdicion={handleLimpiarEdicion}
          />
        </section>

        <section className="mb-10">
          <Filtros filtros={filtros} setFiltros={setFiltros} onLimpiar={limpiarFiltros} />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-2 border-blue-200 pb-2 inline-block">
            Lista de Participantes
          </h2>

          {participantesFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {participantesFiltrados.map((p) => (
                <ParticipanteCard
                  key={p.id}
                  participante={p}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-16 rounded-2xl text-center shadow-inner border-4 border-dashed border-gray-100">
              <div className="text-gray-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-gray-400 text-xl font-medium">"No hay participantes"</p>
              <p className="text-gray-400 text-sm mt-2">Intenta ajustar los filtros o registra uno nuevo.</p>
            </div>
          )}
        </section>
      </div>

      <footer className="mt-20 text-center text-gray-400 text-xs pb-10">&copy; 2026 - UTN Facultad Regional Mendoza</footer>
    </div>
  )
}

export default Home
