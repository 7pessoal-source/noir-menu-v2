// Tipos do banco de dados Supabase

export interface Category {
  id: string;
  name: string;
  order: number;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  available: boolean;
  created_at: string;
}

export interface MenuConfig {
  id: string;
  whatsapp_number: string;
  minimum_order: number;
  neighborhoods: string[];
  restaurant_name?: string;
  restaurant_tagline?: string;
  open_time?: string;
  close_time?: string;
  working_days?: string;
  is_open?: boolean;
  updated_at: string;
}

// Tipo auxiliar para categorias com produtos
export interface CategoryWithProducts extends Category {
  products: Product[];
}
