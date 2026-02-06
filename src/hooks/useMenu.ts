
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

      // Tentar buscar da nova tabela 'settings' primeiro
      const { data: settingsData } = await supabase
        .from('settings')
        .select('key, value');

      if (settingsData && settingsData.length > 0) {
        const s: Record<string, any> = {};
        settingsData.forEach(item => {
          s[item.key] = item.value;
        });

        // Obter o dia da semana atual em inglês para bater com as chaves do banco
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = days[new Date().getDay()];
        const todaySettings = s[`hours.${today}`] || { open: '18:00', close: '23:00', closed: false };

        // Mapear nova estrutura para a interface MenuConfig esperada pelo cardápio
        const mappedConfig: MenuConfig = {
          id: 'dynamic',
          whatsapp_number: s['general.phone'] || '',
          minimum_order: s['orders.minimum_value'] || 0,
          neighborhoods: s['delivery.neighborhoods'] || [],
          restaurant_name: s['general.name'] || 'Noir Menu',
          restaurant_tagline: s['general.description'] || 'O melhor sabor da cidade',
          is_open: s['orders.enabled'] !== false && !todaySettings.closed,
          open_time: todaySettings.open || '18:00',
          close_time: todaySettings.close || '23:00',
          working_days: 'Todos os dias', // Simplificado ou pode ser mapeado
          updated_at: new Date().toISOString()
        };
        setConfig(mappedConfig);
      } else {
        // Fallback para a tabela antiga 'menu_config'
        const { data: configData } = await supabase
          .from('menu_config')
          .select('*')
          .limit(1)
          .single();
        
        if (configData) {
          setConfig(configData);
        }
      }

      setCategories(categoriesData || []);
      setProducts(productsData || []);
    } catch (err) {
      console.error('Erro ao carregar dados do menu:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const categoriesChannel = supabase
      .channel('categories_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => fetchData())
      .subscribe();

    const productsChannel = supabase
      .channel('products_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchData())
      .subscribe();

    const settingsChannel = supabase
      .channel('settings_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => fetchData())
      .subscribe();

    return () => {
      categoriesChannel.unsubscribe();
      productsChannel.unsubscribe();
      settingsChannel.unsubscribe();
    };
  }, []);

  const categoriesWithProducts = categories.map(category => ({
    ...category,
    products: products.filter(p => p.category_id === category.id)
  })).filter(cat => cat.products.length > 0);

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
