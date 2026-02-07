import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client"; // Ajustado para o caminho padrão do Lovable

export default function Menu() {
  const { slug } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      
      try {
        setLoading(true);
        // 1️⃣ Buscar restaurante pelo slug
        const { data: restaurantData, error: restaurantError } = await supabase
          .from("restaurants")
          .select("id, name")
          .eq("slug", slug)
          .eq("is_active", true)
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

  if (loading) {
    return <div className="p-8 text-center">Carregando cardápio...</div>;
  }

  if (!restaurant) {
    return <div className="p-8 text-center text-red-600 font-bold">Restaurante não encontrado</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold">{restaurant.name}</h1>
        <p className="text-gray-500">Cardápio Digital</p>
      </header>

      <div className="grid gap-4">
        {products.length === 0 ? (
          <p className="text-gray-500">Nenhum produto disponível no momento.</p>
        ) : (
          products.map((product: any) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-600 text-sm">{product.description}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-700">
                  R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
