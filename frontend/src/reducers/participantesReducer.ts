import type { Participante, Action } from '../models/Participante'

export function participantesReducer(
  state: Participante[],
  action: Action,
): Participante[] {
  switch (action.type) {
    case 'GET_PARTICIPANTES':
      return action.payload

    case 'AGREGAR': {
      return [...state, action.payload]
    }

    case 'ELIMINAR': {
      return state.filter((p) => p.id !== action.payload)
    }

    case 'EDITAR': {
      return state.map((p) =>
        p.id === action.payload.id ? action.payload : p,
      )
    }

    case 'SET':
      return action.payload

    case 'RESET':
      return action.payload

    default:
      return state
  }
}
