import { useState } from "react";
import { ShoppingCart, Minus, Plus, Trash2, X, ChevronRight } from "lucide-react";
import { CartItem } from "@/types/menu";
import { DELIVERY_CONFIG } from "@/config/menuConfig";

interface CartProps {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
}

export function Cart({
  items,
  subtotal,
  totalItems,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const { minimumOrder, minimumOrderEnabled } = DELIVERY_CONFIG;
  const meetsMinimum = !minimumOrderEnabled || subtotal >= minimumOrder;

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-6 right-6 z-40
          flex items-center gap-3 px-5 py-3.5 rounded-full
          bg-primary text-primary-foreground
          shadow-lg gold-glow btn-gold-hover
          ${totalItems > 0 ? "animate-pulse-gold" : ""}
        `}
      >
        <ShoppingCart className="w-5 h-5" />
        {totalItems > 0 && (
          <>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
            <span className="bg-primary-foreground text-primary w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
              {totalItems}
            </span>
          </>
        )}
      </button>

      {/* Cart Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 animate-slide-in-right flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Seu Pedido
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-gold">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <ShoppingCart className="w-12 h-12 mb-4 opacity-50" />
                  <p>Seu carrinho está vazio</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 p-3 rounded-lg bg-secondary/50"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <p className="text-primary font-semibold text-sm mt-1">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-border transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-border transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRemove(item.product.id)}
                          className="w-8 h-8 rounded-full bg-destructive/20 text-destructive flex items-center justify-center hover:bg-destructive/30 transition-colors ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-border space-y-4">
                {/* Minimum Order Warning */}
                {!meetsMinimum && (
                  <div className="p-3 rounded-lg bg-yellow-950/30 border border-yellow-900/50 text-yellow-300 text-sm">
                    Pedido mínimo: {formatPrice(minimumOrder)}. Faltam{" "}
                    {formatPrice(minimumOrder - subtotal)}.
                  </div>
                )}

                {/* Subtotal */}
                <div className="flex items-center justify-between text-lg">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onCheckout();
                  }}
                  disabled={!meetsMinimum}
                  className={`
                    w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-2
                    transition-all duration-300
                    ${
                      meetsMinimum
                        ? "bg-primary text-primary-foreground btn-gold-hover"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }
                  `}
                >
                  Finalizar Pedido
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}