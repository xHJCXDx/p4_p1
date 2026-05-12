import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pedido } from '../types/pedido';

const API_URL = 'http://localhost:8000/pedidos';

// Fetch all pedidos
const fetchPedidos = async (limit = 100, offset = 0): Promise<Pedido[]> => {
  const response = await fetch(`${API_URL}/?limit=${limit}&offset=${offset}`);
  const result = await response.json();

  if (result.success && result.data) {
    const items = result.data.items || result.data;
    return Array.isArray(items) ? items : [];
  }
  return result;
};

// Fetch single pedido
const fetchPedido = async (id: number): Promise<Pedido> => {
  const response = await fetch(`${API_URL}/${id}`);
  const result = await response.json();
  if (result.success && result.data) return result.data;
  return result;
};

// Create pedido
const createPedido = async (
  data: Omit<Pedido, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
): Promise<Pedido> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Error creating pedido');
  const result = await response.json();
  return result.data || result;
};

// Update pedido
const updatePedido = async (
  id: number,
  data: Omit<Pedido, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
): Promise<Pedido> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Error updating pedido');
  const result = await response.json();
  return result.data || result;
};

// Delete pedido
const deletePedido = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Error deleting pedido');
};

// Hooks
export const usePedidos = (limit = 100, offset = 0) => {
  return useQuery({
    queryKey: ['pedidos', limit, offset],
    queryFn: () => fetchPedidos(limit, offset),
  });
};

export const usePedido = (id: number) => {
  return useQuery({
    queryKey: ['pedido', id],
    queryFn: () => fetchPedido(id),
    enabled: !!id,
  });
};

export const useCreatePedido = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Pedido, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) =>
      createPedido(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
};

export const useUpdatePedido = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Omit<Pedido, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
    }) => updatePedido(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
};

export const useDeletePedido = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePedido(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
};
