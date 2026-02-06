/* =============================================================================
   TIPOS DO CARDÁPIO DIGITAL
   ============================================================================= */

export interface RestaurantConfig {
  name: string;
  tagline: string;
  whatsappNumber: string;
  schedule: {
    isOpen: boolean;
    openTime: string;
    closeTime: string;
    workingDays: string;
    closedMessage: string;
  };
}

export interface DeliveryConfig {
  minimumOrder: number;
  minimumOrderEnabled: boolean;
  estimatedTime: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  deliveryFee: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutData {
  neighborhood: Neighborhood | null;
  address: {
    street: string;
    number: string;
    complement: string;
    reference: string;
  };
  paymentMethod: string;
  notes: string;
  customerWhatsApp: string;
}