import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Producto } from '../types/producto';

const API_URL = 'http://localhost:8000/productos';

// Fetch all productos
const fetchProductos = async (limit = 100, offset = 0): Promise<Producto[]> => {
  const url = new URL(API_URL);
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('offset', offset.toString());

  const response = await fetch(url.toString());
  const result = await response.json();

  if (result.success && result.data) {
    const items = result.data.items || result.data;
    return Array.isArray(items) ? items : [];
  }
  return result;
};

// Fetch single producto
const fetchProducto = async (id: number): Promise<Producto> => {
  const response = await fetch(`${API_URL}/${id}`);
  const result = await response.json();
  if (result.success && result.data) return result.data;
  return result;
};

// Create producto
const createProducto = async (
  data: Omit<Producto, 'id' | 'created_at' | 'updated_at'>
): Promise<Producto> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Error creating producto');
  const result = await response.json();
  return result.data || result;
};

// Update producto
const updateProducto = async (
  id: number,
  data: Omit<Producto, 'id' | 'created_at' | 'updated_at'>
): Promise<Producto> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Error updating producto');
  const result = await response.json();
  return result.data || result;
};

// Delete producto
const deleteProducto = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Error deleting producto');
};

// Hooks
export const useProductos = (limit = 100, offset = 0) => {
  return useQuery({
    queryKey: ['productos', limit, offset],
    queryFn: () => fetchProductos(limit, offset),
  });
};

export const useProducto = (id: number) => {
  return useQuery({
    queryKey: ['producto', id],
    queryFn: () => fetchProducto(id),
    enabled: !!id,
  });
};

export const useCreateProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Producto, 'id' | 'created_at' | 'updated_at'>) =>
      createProducto(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
};

export const useUpdateProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Omit<Producto, 'id' | 'created_at' | 'updated_at'>;
    }) => updateProducto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
};

export const useDeleteProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProducto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
};
