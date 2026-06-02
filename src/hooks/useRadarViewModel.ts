import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types/database';

/**
 * ViewModel for the Radar (Product Management)
 * Handles fetching, adding, and deleting products for the logged-in user.
 */
export function useRadarViewModel() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err: any) {
      const message = err.message || 'Erro ao carregar produtos do Radar';
      setError(message);
      console.error('Error fetching radar products:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addProduct = async (product: Partial<Product>) => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const { data, error: insertError } = await supabase
        .from('products')
        .insert([{ ...product, user_id: user.id }])
        .select()
        .single();

      if (insertError) throw insertError;
      setProducts(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      const message = err.message || 'Erro ao adicionar produto';
      setError(message);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      const message = err.message || 'Erro ao remover produto';
      setError(message);
      throw err;
    }
  };

  const updateProductStatus = async (id: string, status: Product['status']) => {
    try {
      const { error: updateError } = await supabase
        .from('products')
        .update({ status })
        .eq('id', id);

      if (updateError) throw updateError;
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    } catch (err: any) {
      const message = err.message || 'Erro ao atualizar status do produto';
      setError(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user, fetchProducts]);

  return {
    products,
    loading,
    error,
    refresh: fetchProducts,
    addProduct,
    deleteProduct,
    updateProductStatus
  };
}
