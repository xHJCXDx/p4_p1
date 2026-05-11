import React from 'react';
import { MODALITIES, LEVELS } from '../models/Participante';

export interface FiltrosData {
  nombre: string;
  modalidad: string;
  nivel: string;
}

interface FiltrosProps {
  filtros: FiltrosData;
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosData>>;
  onLimpiar: () => void;
}

const Filtros: React.FC<FiltrosProps> = ({ filtros, setFiltros, onLimpiar }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Sección de Filtros</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Buscar por nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre</label>
          <input
            type="text"
            placeholder="Ej: Juan..."
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            value={filtros.nombre}
            onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
          />
        </div>

        {/* Filtrar por modalidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por modalidad</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            value={filtros.modalidad}
            onChange={(e) => setFiltros({ ...filtros, modalidad: e.target.value })}
          >
            <option value="Todas">Todas</option>
            {MODALITIES.map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
        </div>

        {/* Filtrar por nivel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por nivel</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            value={filtros.nivel}
            onChange={(e) => setFiltros({ ...filtros, nivel: e.target.value })}
          >
            <option value="Todos">Todos</option>
            {LEVELS.map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
        </div>

        {/* Botón Limpiar filtros */}
        <div>
          <button
            onClick={onLimpiar}
            className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition font-medium"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filtros;
