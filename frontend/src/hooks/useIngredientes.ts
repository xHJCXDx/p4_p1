import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ingrediente } from '../types/ingrediente';

const API_URL = 'http://localhost:8000/ingredientes';

// Fetch all ingredientes
const fetchIngredientes = async (limit = 100, offset = 0): Promise<Ingrediente[]> => {
  const response = await fetch(`${API_URL}?limit=${limit}&offset=${offset}`);
  const result = await response.json();

  if (result.success && result.data) {
    const items = result.data.items || result.data;
    return Array.isArray(items) ? items : [];
  }
  return result;
};

// Fetch single ingrediente
const fetchIngrediente = async (id: number): Promise<Ingrediente> => {
  const response = await fetch(`${API_URL}/${id}`);
  const result = await response.json();
  if (result.success && result.data) return result.data;
  return result;
};

// Create ingrediente
const createIngrediente = async (
  data: Omit<Ingrediente, 'id' | 'created_at' | 'updated_at'>
): Promise<Ingrediente> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Error creating ingrediente');
  const result = await response.json();
  return result.data || result;
};

// Update ingrediente
const updateIngrediente = async (
  id: number,
  data: Omit<Ingrediente, 'id' | 'created_at' | 'updated_at'>
): Promise<Ingrediente> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Error updating ingrediente');
  const result = await response.json();
  return result.data || result;
};

// Delete ingrediente
const deleteIngrediente = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Error deleting ingrediente');
};

// Hooks
export const useIngredientes = (limit = 100, offset = 0) => {
  return useQuery({
    queryKey: ['ingredientes', limit, offset],
    queryFn: () => fetchIngredientes(limit, offset),
  });
};

export const useIngrediente = (id: number) => {
  return useQuery({
    queryKey: ['ingrediente', id],
    queryFn: () => fetchIngrediente(id),
    enabled: !!id,
  });
};

export const useCreateIngrediente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Ingrediente, 'id' | 'created_at' | 'updated_at'>) =>
      createIngrediente(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
    },
  });
};

export const useUpdateIngrediente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Omit<Ingrediente, 'id' | 'created_at' | 'updated_at'>;
    }) => updateIngrediente(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
    },
  });
};

export const useDeleteIngrediente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteIngrediente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
    },
  });
};
