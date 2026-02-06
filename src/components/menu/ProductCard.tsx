import { Plus } from "lucide-react";
import { Product } from "@/types/menu";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="gradient-gold-card rounded-xl border border-border overflow-hidden card-hover flex flex-col h-full">
      {/* Product Image */}
      {product.image && (
        <div className="relative w-full aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
        </div>
      )}

      {/* Product Info */}
      <div className="flex-1 p-4">
        <h3 className="font-display text-base md:text-lg font-semibold text-foreground mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-xs md:text-sm line-clamp-2">
          {product.description}
        </p>
      </div>

      {/* Price & Add Button */}
      <div className="flex items-center justify-between p-4 pt-0">
        <span className="text-primary font-bold text-base md:text-lg">
          {formatPrice(product.price)}
        </span>
        <button
          onClick={() => onAdd(product)}
          className="
            flex items-center gap-1.5 px-3 py-2 rounded-lg
            bg-primary text-primary-foreground
            text-sm font-medium
            btn-gold-hover
          "
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Adicionar</span>
        </button>
      </div>
    </div>
  );
}