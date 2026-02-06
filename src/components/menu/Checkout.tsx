import { useState } from "react";
import { X, MapPin, CreditCard, MessageSquare, Phone, ChevronDown, Banknote, QrCode } from "lucide-react";
import { CartItem, CheckoutData, Neighborhood } from "@/types/menu";
import {
  RESTAURANT_CONFIG,
  DELIVERY_CONFIG,
  NEIGHBORHOODS,
  PAYMENT_METHODS,
} from "@/config/menuConfig";

interface CheckoutProps {
  items: CartItem[];
  subtotal: number;
  onClose: () => void;
  onComplete: () => void;
}

export function Checkout({ items, subtotal, onClose, onComplete }: CheckoutProps) {
  const [data, setData] = useState<CheckoutData>({
    neighborhood: null,
    address: {
      street: "",
      number: "",
      complement: "",
      reference: "",
    },
    paymentMethod: "",
    notes: "",
    customerWhatsApp: "",
  });

  const [errors, setErrors] = useState<string[]>([]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const deliveryFee = data.neighborhood?.deliveryFee || 0;
  const total = subtotal + deliveryFee;

  const validate = (): boolean => {
    const newErrors: string[] = [];

    if (!RESTAURANT_CONFIG.schedule.isOpen) {
      newErrors.push("O restaurante está fechado no momento.");
    }

    if (items.length === 0) {
      newErrors.push("Seu carrinho está vazio.");
    }

    if (DELIVERY_CONFIG.minimumOrderEnabled && subtotal < DELIVERY_CONFIG.minimumOrder) {
      newErrors.push(`Pedido mínimo não atingido: ${formatPrice(DELIVERY_CONFIG.minimumOrder)}`);
    }

    if (!data.neighborhood) {
      newErrors.push("Selecione um bairro.");
    }

    if (!data.address.street.trim()) {
      newErrors.push("Informe a rua.");
    }

    if (!data.address.number.trim()) {
      newErrors.push("Informe o número.");
    }

    if (!data.paymentMethod) {
      newErrors.push("Selecione a forma de pagamento.");
    }

    if (!data.customerWhatsApp.trim()) {
      newErrors.push("Informe seu WhatsApp.");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const generateWhatsAppMessage = (): string => {
    const lines: string[] = [
      "🍽️ *NOVO PEDIDO - " + RESTAURANT_CONFIG.name.toUpperCase() + "*",
      "",
      "📋 *ITENS DO PEDIDO:*",
    ];

    items.forEach((item) => {
      lines.push(
        `• ${item.quantity}x ${item.product.name} - ${formatPrice(item.product.price * item.quantity)}`
      );
    });

    lines.push("");
    lines.push("💰 *VALORES:*");
    lines.push(`Subtotal: ${formatPrice(subtotal)}`);
    lines.push(`Taxa de Entrega (${data.neighborhood?.name}): ${formatPrice(deliveryFee)}`);
    lines.push(`*TOTAL: ${formatPrice(total)}*`);

    lines.push("");
    lines.push("📍 *ENDEREÇO:*");
    lines.push(`Bairro: ${data.neighborhood?.name}`);
    lines.push(`Rua: ${data.address.street}, ${data.address.number}`);
    if (data.address.complement) {
      lines.push(`Complemento: ${data.address.complement}`);
    }
    if (data.address.reference) {
      lines.push(`Referência: ${data.address.reference}`);
    }

    lines.push("");
    lines.push("💳 *PAGAMENTO:*");
    const paymentName = PAYMENT_METHODS.find((p) => p.id === data.paymentMethod)?.name || data.paymentMethod;
    lines.push(paymentName);

    if (data.notes.trim()) {
      lines.push("");
      lines.push("📝 *OBSERVAÇÕES:*");
      lines.push(data.notes);
    }

    lines.push("");
    lines.push("📱 *WHATSAPP DO CLIENTE:*");
    lines.push(data.customerWhatsApp);

    return encodeURIComponent(lines.join("\n"));
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${RESTAURANT_CONFIG.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
    onComplete();
  };

  const getPaymentIcon = (iconName: string) => {
    switch (iconName) {
      case "banknote":
        return <Banknote className="w-5 h-5" />;
      case "qr-code":
        return <QrCode className="w-5 h-5" />;
      case "credit-card":
        return <CreditCard className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-background rounded-2xl border border-border scrollbar-gold">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
          <h2 className="font-display text-xl font-semibold">Finalizar Pedido</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="p-4 rounded-lg bg-destructive/20 border border-destructive/50 space-y-1">
              {errors.map((error, i) => (
                <p key={i} className="text-destructive text-sm">• {error}</p>
              ))}
            </div>
          )}

          {/* 1. Neighborhood Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="w-4 h-4 text-primary" />
              Bairro *
            </label>
            <div className="relative">
              <select
                value={data.neighborhood?.id || ""}
                onChange={(e) => {
                  const neighborhood = NEIGHBORHOODS.find((n) => n.id === e.target.value);
                  setData((prev) => ({ ...prev, neighborhood: neighborhood || null }));
                }}
                className="w-full appearance-none px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              >
                <option value="">Selecione seu bairro</option>
                {NEIGHBORHOODS.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name} - Taxa: {formatPrice(n.deliveryFee)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* 2. Address (shown after neighborhood selection) */}
          {data.neighborhood && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Endereço de Entrega
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Rua *"
                    value={data.address.street}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        address: { ...prev.address, street: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Nº *"
                    value={data.address.number}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        address: { ...prev.address, number: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </div>

              <input
                type="text"
                placeholder="Complemento (opcional)"
                value={data.address.complement}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    address: { ...prev.address, complement: e.target.value },
                  }))
                }
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />

              <input
                type="text"
                placeholder="Referência (opcional)"
                value={data.address.reference}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    address: { ...prev.address, reference: e.target.value },
                  }))
                }
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          )}

          {/* 3. Payment Method */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <CreditCard className="w-4 h-4 text-primary" />
              Forma de Pagamento *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setData((prev) => ({ ...prev, paymentMethod: method.id }))}
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-300
                    ${
                      data.paymentMethod === method.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-secondary hover:border-primary/50"
                    }
                  `}
                >
                  {getPaymentIcon(method.icon)}
                  <span className="text-xs font-medium">{method.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Notes */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="w-4 h-4 text-primary" />
              Observações
            </label>
            <textarea
              placeholder="Ex: Sem cebola, molho à parte..."
              value={data.notes}
              onChange={(e) => setData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
            />
          </div>

          {/* 5. Customer WhatsApp */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Phone className="w-4 h-4 text-primary" />
              Seu WhatsApp *
            </label>
            <input
              type="tel"
              placeholder="(00) 00000-0000"
              value={data.customerWhatsApp}
              onChange={(e) => setData((prev) => ({ ...prev, customerWhatsApp: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          {/* Order Summary */}
          <div className="space-y-3 p-4 rounded-lg bg-secondary/50 border border-border">
            <h3 className="font-medium">Resumo do Pedido</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Taxa de Entrega {data.neighborhood && `(${data.neighborhood.name})`}
                </span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-semibold btn-gold-hover flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            Enviar Pedido via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}