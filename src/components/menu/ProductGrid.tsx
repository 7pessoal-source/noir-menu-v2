import { Product } from "@/types/menu";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  selectedCategory: string;
  onAddProduct: (product: Product) => void;
  products: Product[];
}

export function ProductGrid({ selectedCategory, onAddProduct, products }: ProductGridProps) {
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <section className="py-8">
      <div className="container">
        {/* Products Grid - 4 per row on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard product={product} onAdd={onAddProduct} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum produto encontrado nesta categoria.
          </div>
        )}
      </div>
    </section>
  );
}
