import { useState, useMemo } from "react";
import { Header } from "@/components/menu/Header";
import { CategoryFilter } from "@/components/menu/CategoryFilter";
import { ProductGrid } from "@/components/menu/ProductGrid";
import { Cart } from "@/components/menu/Cart";
import { Checkout } from "@/components/menu/Checkout";
import { useCart } from "@/hooks/useCart";
import { useMenu } from "@/hooks/useMenu";
import { ExternalLink } from "lucide-react";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCheckout, setShowCheckout] = useState(false);
  
  const { categories, categoriesWithProducts, config, loading, error } = useMenu();
  
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
  } = useCart();

  const handleCheckoutComplete = () => {
    clearCart();
    setShowCheckout(false);
  };

  // Transform Supabase categories to the format expected by CategoryFilter
  const filterCategories = useMemo(() => {
    const base = [{ id: "all", name: "Todos" }];
    const fromDb = categories.map(c => ({ id: c.id, name: c.name }));
    return [...base, ...fromDb];
  }, [categories]);

  // Transform Supabase products to the format expected by ProductGrid
  const allProducts = useMemo(() => {
    return categoriesWithProducts.flatMap(cat => 
      cat.products.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || "",
        price: Number(p.price),
        category: p.category_id,
        image: p.image_url || undefined
      }))
    );
  }, [categoriesWithProducts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-destructive/10 border border-destructive rounded-lg p-6 max-w-md text-center">
          <h2 className="text-destructive text-xl font-bold mb-2">Erro ao carregar cardápio</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Category Filter */}
      <div className="py-6 border-b border-border">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {filterCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  px-5 py-2.5 rounded-full text-sm font-medium
                  transition-all duration-300
                  ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground gold-glow"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <ProductGrid
        selectedCategory={selectedCategory}
        onAddProduct={addItem}
        // Pass the products from Supabase
        products={allProducts}
      />

      {/* Delivery Info Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container">
          <div className="text-center space-y-4">
            {config && config.neighborhoods && config.neighborhoods.length > 0 && (
              <>
                <h3 className="font-display text-lg text-primary">Bairros que sua empresa atende</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {config.neighborhoods.map((n, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 text-xs rounded-full bg-secondary text-secondary-foreground"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </>
            )}
            
            {config && Number(config.minimum_order) > 0 && (
              <p className="text-muted-foreground text-sm">
                Pedido mínimo:{" "}
                {Number(config.minimum_order).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            )}

            <div className="pt-6">
              <a
                href="https://noir-menu-adminatualizad.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-5 h-5" />
                🔐 Acessar Painel Administrativo
              </a>
              <p className="text-muted-foreground text-xs mt-4">
                © {new Date().getFullYear()} Noir Menu
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart */}
      <Cart
        items={items}
        subtotal={subtotal}
        totalItems={totalItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
        onCheckout={() => setShowCheckout(true)}
      />

      {/* Checkout Modal */}
      {showCheckout && (
        <Checkout
          items={items}
          subtotal={subtotal}
          onClose={() => setShowCheckout(false)}
          onComplete={handleCheckoutComplete}
        />
      )}
    </div>
  );
};

export default Index;
