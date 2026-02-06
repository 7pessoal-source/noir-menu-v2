import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Category, Product, MenuConfig } from '../types/database';

/**
 * Hook customizado para gerenciar dados do cardápio
 * Conecta ao Supabase e mantém sincronização em tempo real
 */
export const useMenu = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<MenuConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar todas as categorias ordenadas
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('order', { ascending: true });

      if (categoriesError) throw categoriesError;

      // Buscar apenas produtos disponíveis
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('available', true);

      if (productsError) throw productsError;

      // Buscar configurações do menu
      const { data: configData, error: configError } = await supabase
        .from('menu_config')
        .select('*')
        .limit(1)
        .single();

      if (configError && configError.code !== 'PGRST116') {
        // PGRST116 = nenhum registro encontrado (não é erro crítico)
        throw configError;
      }

      setCategories(categoriesData || []);
      setProducts(productsData || []);
      setConfig(configData || null);
    } catch (err) {
      console.error('Erro ao carregar dados do menu:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Buscar dados iniciais
    fetchData();

    // Configurar subscriptions para atualizações em tempo real
    const categoriesChannel = supabase
      .channel('categories_realtime')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'categories' 
        },
        (payload) => {
          console.log('Categoria atualizada:', payload);
          fetchData();
        }
      )
      .subscribe();

    const productsChannel = supabase
      .channel('products_realtime')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'products' 
        },
        (payload) => {
          console.log('Produto atualizado:', payload);
          fetchData();
        }
      )
      .subscribe();

    const configChannel = supabase
      .channel('config_realtime')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'menu_config' 
        },
        (payload) => {
          console.log('Configuração atualizada:', payload);
          fetchData();
        }
      )
      .subscribe();

    // Cleanup: desinscrever ao desmontar componente
    return () => {
      categoriesChannel.unsubscribe();
      productsChannel.unsubscribe();
      configChannel.unsubscribe();
    };
  }, []);

  // Agrupar produtos por categoria
  const categoriesWithProducts = categories.map(category => ({
    ...category,
    products: products.filter(p => p.category_id === category.id)
  })).filter(cat => cat.products.length > 0); // Apenas categorias com produtos

  return {
    categories,
    products,
    config,
    categoriesWithProducts,
    loading,
    error,
    refetch: fetchData
  };
};
