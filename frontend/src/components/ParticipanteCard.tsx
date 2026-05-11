import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { Participante } from '../models/Participante'
import { useParticipantes } from '../context/ParticipantesContext'

interface ParticipanteCardProps {
  participante: Participante
}

const ParticipanteCard: React.FC<ParticipanteCardProps> = ({ participante }) => {
  const navigate = useNavigate()
  const { eliminar } = useParticipantes()
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-blue-200">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
        <h3 className="text-xl font-bold text-white truncate">{participante.nombre}</h3>
        <p className="text-blue-100 text-sm italic">{participante.pais}</p>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</p>
            <p className="text-sm text-gray-700 font-medium break-words">{participante.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Edad</p>
            <p className="text-sm text-gray-700 font-medium">{participante.edad} años</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nivel</p>
            <span
              className={`inline-block mt-1 px-2 py-1 text-xs font-bold rounded-full ${
                participante.nivel === 'Principiante'
                  ? 'bg-green-100 text-green-700'
                  : participante.nivel === 'Intermedio'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
              }`}
            >
              {participante.nivel}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Modalidad</p>
            <p className="text-sm text-gray-700 font-medium">{participante.modalidad}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tecnologías</p>
          <div className="flex flex-wrap gap-2">
            {participante.tecnologias.map((tech) => (
              <span key={tech} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs border border-gray-200">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex gap-2">
          <button
            onClick={() => navigate(`/editar/${participante.id}`)}
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 py-2 rounded-lg font-bold text-sm border border-blue-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Editar</span>
          </button>

          <button
            onClick={() => eliminar(participante.id)}
            className="flex-1 flex items-center justify-center space-x-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-300 py-2 rounded-lg font-bold text-sm border border-red-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ParticipanteCard
