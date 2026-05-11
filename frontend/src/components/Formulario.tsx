import React, { useState, useEffect } from 'react'
import type { Level, Modality, Technology, Participante } from '../models/Participante'
import { COUNTRIES, LEVELS, MODALITIES, TECHNOLOGIES } from '../models/Participante'

interface FormularioProps {
  onAgregar?: (participante: Omit<Participante, 'id'>) => void
  onEditar?: (participante: Participante) => void
  participanteActual?: Participante | null
  onLimpiarEdicion?: () => void
  onSuccess?: () => void
}

const Formulario: React.FC<FormularioProps> = ({
  onAgregar,
  onEditar,
  participanteActual,
  onLimpiarEdicion,
  onSuccess,
}) => {
  const initialFormState = {
    nombre: '',
    email: '',
    edad: 18,
    pais: 'Argentina',
    modalidad: 'Presencial' as Modality,
    tecnologias: [] as Technology[],
    nivel: 'Principiante' as Level,
    aceptaTerminos: false,
  }

  const [formData, setFormData] = useState(initialFormState)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (participanteActual) {
      setFormData({
        nombre: participanteActual.nombre,
        email: participanteActual.email,
        edad: participanteActual.edad,
        pais: participanteActual.pais,
        modalidad: participanteActual.modalidad,
        tecnologias: participanteActual.tecnologias,
        nivel: participanteActual.nivel,
        aceptaTerminos: participanteActual.aceptaTerminos,
      })
    } else {
      setFormData(initialFormState)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participanteActual?.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.aceptaTerminos) {
      alert('Debes aceptar los términos y condiciones')
      return
    }

    setIsLoading(true)

    if (participanteActual) {
      onEditar?.({ ...formData, id: participanteActual.id })
    } else {
      onAgregar?.(formData)
    }

    setFormData(initialFormState)
    onLimpiarEdicion?.()
    onSuccess?.()
    setIsLoading(false)
  }

  const handleCheckboxChange = (tech: Technology) => {
    setFormData((prev) => ({
      ...prev,
      tecnologias: prev.tecnologias.includes(tech)
        ? prev.tecnologias.filter((t) => t !== tech)
        : [...prev.tecnologias, tech],
    }))
  }

  const handleLimpiar = () => {
    setFormData(initialFormState)
    onLimpiarEdicion?.()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8 border border-blue-100">
      <h2 className="text-xl font-bold mb-4 text-blue-800">
        {participanteActual ? 'Editar participante' : 'Alta de participante'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        {/* Edad */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Edad</label>
          <input
            type="number"
            required
            min="1"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.edad}
            onChange={(e) => setFormData({ ...formData, edad: parseInt(e.target.value) || 0 })}
          />
        </div>

        {/* País */}
        <div>
          <label className="block text-sm font-medium text-gray-700">País</label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.pais}
            onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
          >
            {COUNTRIES.map((pais) => (
              <option key={pais} value={pais}>
                {pais}
              </option>
            ))}
          </select>
        </div>

        {/* Modalidad */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Modalidad de asistencia</label>
          <div className="flex flex-wrap gap-4">
            {MODALITIES.map((mod) => (
              <label key={mod} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="modalidad"
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  checked={formData.modalidad === mod}
                  onChange={() => setFormData({ ...formData, modalidad: mod })}
                />
                <span>{mod}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tecnologías */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tecnologías conocidas</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {TECHNOLOGIES.map((tech) => (
              <label key={tech} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  checked={formData.tecnologias.includes(tech)}
                  onChange={() => handleCheckboxChange(tech)}
                />
                <span>{tech}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Nivel de experiencia */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nivel de experiencia</label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.nivel}
            onChange={(e) => setFormData({ ...formData, nivel: e.target.value as Level })}
          >
            {LEVELS.map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
        </div>

        {/* Acepta términos */}
        <div className="md:col-span-2 flex items-center space-x-2">
          <input
            type="checkbox"
            required
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            checked={formData.aceptaTerminos}
            onChange={(e) => setFormData({ ...formData, aceptaTerminos: e.target.checked })}
          />
          <span className="text-sm">Acepto los términos y condiciones del evento</span>
        </div>

        {/* Botones */}
        <div className="md:col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (participanteActual ? 'Actualizando...' : 'Registrando...') : participanteActual ? 'Actualizar' : 'Registrar Participante'}
          </button>

          {participanteActual && (
            <button
              type="button"
              onClick={handleLimpiar}
              className="flex-1 md:flex-none bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition font-bold shadow-md"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

export default Formulario
