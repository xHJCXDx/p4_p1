/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useReducer, type ReactNode, type Dispatch } from 'react'
import { participantesReducer } from '../reducers/participantesReducer'
import type { Participante, Action } from '../models/Participante'

interface ContextType {
  participantes: Participante[]
  dispatch: Dispatch<Action>
  agregar: (p: Omit<Participante, 'id'>) => void
  eliminar: (id: number) => void
  editar: (p: Participante) => void
  resetear: () => void
  participanteSeleccionado: Participante | null
  seleccionar: (p: Participante | null) => void
}

export const ParticipantesContext = createContext<ContextType | undefined>(undefined)

const API_URL = 'http://localhost:8000/participantes'

// Helper para obtener headers con token
const getHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  }
}

export const ParticipantesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [participantes, dispatch] = useReducer(participantesReducer, [])
  const [participanteSeleccionado, setParticipanteSeleccionado] = React.useState<Participante | null>(null)

  // Obtener participantes al cargar
  useEffect(() => {
    const fetchParticipantes = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: getHeaders(),
        })
        if (response.ok) {
          const data = await response.json()
          dispatch({ type: 'GET_PARTICIPANTES', payload: data.data.items })
        }
      } catch (error) {
        console.error('Error cargando participantes:', error)
      }
    }
    fetchParticipantes()
  }, [])

  const agregar = async (p: Omit<Participante, 'id'>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(p),
      })
      if (response.ok) {
        const data = await response.json()
        dispatch({ type: 'AGREGAR', payload: data.data })
      }
    } catch (error) {
      console.error('Error agregando participante:', error)
    }
  }

  const eliminar = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      })
      if (response.ok) {
        dispatch({ type: 'ELIMINAR', payload: id })
      }
    } catch (error) {
      console.error('Error eliminando participante:', error)
    }
  }

  const editar = async (p: Participante) => {
    try {
      const response = await fetch(`${API_URL}/${p.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(p),
      })
      if (response.ok) {
        const data = await response.json()
        dispatch({ type: 'EDITAR', payload: data.data })
      }
    } catch (error) {
      console.error('Error editando participante:', error)
    }
  }

  const resetear = async () => {
    if (window.confirm('¿Estás seguro de que deseas borrar todos los datos?')) {
      try {
        const response = await fetch(API_URL, {
          method: 'DELETE',
          headers: getHeaders(),
        })
        if (response.ok) {
          dispatch({ type: 'RESET', payload: [] })
        }
      } catch (error) {
        console.error('Error reseteando datos:', error)
      }
    }
  }

  const seleccionar = (p: Participante | null) => {
    setParticipanteSeleccionado(p)
  }

  return (
    <ParticipantesContext.Provider value={{ participantes, dispatch, agregar, eliminar, editar, resetear, participanteSeleccionado, seleccionar }}>
      {children}
    </ParticipantesContext.Provider>
  )
}

export const useParticipantes = () => {
  const context = React.useContext(ParticipantesContext)
  if (!context) {
    throw new Error('useParticipantes debe ser usado dentro de ParticipantesProvider')
  }
  return context
}
