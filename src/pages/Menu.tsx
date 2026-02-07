import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MenuHeader } from "@/components/MenuHeader";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ProductGrid } from "@/components/ProductGrid";
import { supabase } from '../integrations/supabase/client';

const Menu = () => {
  const { slug } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      
      try {
        setLoading(true);
        // 1️⃣ Buscar restaurante pelo slug usando Supabase
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('slug', slug)
          .single();

        if (restaurantError || !restaurantData) {
          console.error("Restaurante não encontrado", restaurantError);
          setLoading(false);
          return;
        }
        setRestaurant(restaurantData);

        // 2️⃣ Buscar produtos pelo restaurant_id
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("restaurant_id", restaurantData.id)
          .eq("available", true);

        if (productsError) {
          console.error("Erro ao buscar produtos", productsError);
        }
        setProducts(productsData || []);
      } catch (error) {
        console.error("Erro inesperado", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  // Estado de loading
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-muted-foreground font-medium">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-red-600 font-bold">
          Restaurante não encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MenuHeader />

      {/* Category Filter */}
      <CategoryTabs
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Products Grid */}
      <ProductGrid
        selectedCategory={selectedCategory}
        onAddProduct={(product) => console.log("Adicionar produto:", product)}
      />

      {/* Footer Simples */}
      <footer className="py-8 border-t border-border">
        <div className="container text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {restaurant.name} - Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Menu;
