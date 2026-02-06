/* =============================================================================
   CARDÁPIO DIGITAL - CONFIGURAÇÃO CENTRALIZADA
   
   Este arquivo contém TODAS as configurações editáveis do cardápio.
   Modifique os valores abaixo para personalizar o cardápio.
   
   ESTRUTURA:
   1. RESTAURANT_CONFIG - Dados gerais do restaurante
   2. DELIVERY_CONFIG - Configurações de entrega e pedido mínimo
   3. NEIGHBORHOODS - Lista de bairros atendidos com taxas
   4. PRODUCTS - Catálogo de produtos (20 itens)
   5. PAYMENT_METHODS - Formas de pagamento aceitas
   ============================================================================= */

import { RestaurantConfig, DeliveryConfig, Neighborhood, Product, PaymentMethod } from "@/types/menu";

// ============================================================================
// IMAGENS DOS PRODUTOS
// Para alterar uma imagem, substitua o arquivo correspondente em src/assets/products/
// ============================================================================
import imgSmashBurger from "@/assets/products/smash-burger.jpg";
import imgTruffleBurger from "@/assets/products/truffle-burger.jpg";
import imgChickenSupreme from "@/assets/products/chicken-supreme.jpg";
import imgVeggieBurger from "@/assets/products/veggie-burger.jpg";
import imgDoubleBacon from "@/assets/products/double-bacon.jpg";
import imgPizzaMargherita from "@/assets/products/pizza-margherita.jpg";
import imgPizzaQuattro from "@/assets/products/pizza-quattro.jpg";
import imgPizzaPepperoni from "@/assets/products/pizza-pepperoni.jpg";
import imgPizzaParma from "@/assets/products/pizza-parma.jpg";
import imgPizzaCalabresa from "@/assets/products/pizza-calabresa.jpg";
import imgBatataRustica from "@/assets/products/batata-rustica.jpg";
import imgOnionRings from "@/assets/products/onion-rings.jpg";
import imgNuggets from "@/assets/products/nuggets.jpg";
import imgMixAperitivos from "@/assets/products/mix-aperitivos.jpg";
import imgTabuaFrios from "@/assets/products/tabua-frios.jpg";
import imgRefrigerante from "@/assets/products/refrigerante.jpg";
import imgSucoNatural from "@/assets/products/suco-natural.jpg";
import imgAguaMineral from "@/assets/products/agua-mineral.jpg";
import imgCerveja from "@/assets/products/cerveja.jpg";
import imgMilkshake from "@/assets/products/milkshake.jpg";

/* -----------------------------------------------------------------------------
   1. CONFIGURAÇÕES GERAIS DO RESTAURANTE
   ----------------------------------------------------------------------------- */
export const RESTAURANT_CONFIG: RestaurantConfig = {
  // Nome exibido no topo do cardápio
  name: "Nome da Sua Empresa",
  
  // Subtítulo/slogan
  tagline: "Seu Slogan",
  
  // Número de WhatsApp que RECEBE os pedidos (com código do país)
  // Formato: 55 + DDD + Número (sem espaços ou traços)
  whatsappNumber: "5511999999999",
  
  // Horário de funcionamento
  schedule: {
    // O restaurante está aberto agora?
    // Mude para false quando quiser pausar os pedidos
    isOpen: true,
    
    // Horário exibido (apenas informativo)
    openTime: "18:00",
    closeTime: "23:00",
    
    // Dias de funcionamento (para exibição)
    workingDays: "Terça a Domingo",
    
    // Mensagem exibida quando o restaurante está FECHADO
    closedMessage: "Estamos fechados no momento. Nosso horário de funcionamento é de Terça a Domingo, das 18h às 23h.",
  },
};

/* -----------------------------------------------------------------------------
   2. CONFIGURAÇÕES DE ENTREGA
   ----------------------------------------------------------------------------- */
export const DELIVERY_CONFIG: DeliveryConfig = {
  // Valor mínimo do pedido (em reais)
  minimumOrder: 30.00,
  
  // Ativar/desativar verificação de pedido mínimo
  // Se false, permite qualquer valor de pedido
  minimumOrderEnabled: true,
  
  // Tempo estimado de entrega (apenas informativo)
  estimatedTime: "40-60 min",
};

/* -----------------------------------------------------------------------------
   3. BAIRROS ATENDIDOS
   
   Adicione ou remova bairros conforme necessário.
   Cada bairro precisa de:
   - id: identificador único
   - name: nome do bairro (exibido para o cliente)
   - deliveryFee: taxa de entrega em reais
   ----------------------------------------------------------------------------- */
export const NEIGHBORHOODS: Neighborhood[] = [
  { id: "centro", name: "Centro", deliveryFee: 5.00 },
  { id: "jardins", name: "Jardins", deliveryFee: 6.00 },
  { id: "vila-madalena", name: "Vila Madalena", deliveryFee: 7.00 },
  { id: "pinheiros", name: "Pinheiros", deliveryFee: 6.50 },
  { id: "moema", name: "Moema", deliveryFee: 8.00 },
  { id: "itaim-bibi", name: "Itaim Bibi", deliveryFee: 7.50 },
  { id: "consolacao", name: "Consolação", deliveryFee: 5.50 },
  { id: "bela-vista", name: "Bela Vista", deliveryFee: 5.00 },
  { id: "liberdade", name: "Liberdade", deliveryFee: 5.00 },
  { id: "paraiso", name: "Paraíso", deliveryFee: 6.00 },
];

/* -----------------------------------------------------------------------------
   4. FORMAS DE PAGAMENTO
   ----------------------------------------------------------------------------- */
export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "dinheiro", name: "Dinheiro", icon: "banknote" },
  { id: "pix", name: "Pix", icon: "qr-code" },
  { id: "cartao", name: "Cartão", icon: "credit-card" },
];

/* -----------------------------------------------------------------------------
   5. CATEGORIAS DOS PRODUTOS
   ----------------------------------------------------------------------------- */
export const CATEGORIES = [
  { id: "all", name: "Todos" },
  { id: "lanches", name: "Lanches" },
  { id: "pizzas", name: "Pizzas" },
  { id: "porcoes", name: "Porções" },
  { id: "bebidas", name: "Bebidas" },
] as const;

/* -----------------------------------------------------------------------------
   6. CATÁLOGO DE PRODUTOS (20 ITENS)
   
   Cada produto precisa de:
   - id: identificador único
   - name: nome do produto
   - description: descrição curta
   - price: preço em reais
   - category: categoria (lanches, pizzas, porcoes, bebidas)
   - image: imagem do produto (importada acima)
   ----------------------------------------------------------------------------- */
export const PRODUCTS: Product[] = [
  // ======================== LANCHES ========================
  {
    id: "lanche-01",
    name: "Smash Burger Noir",
    description: "Blend de carnes nobres, queijo cheddar, bacon crocante e molho especial da casa",
    price: 38.90,
    category: "lanches",
    image: imgSmashBurger,
  },
  {
    id: "lanche-02",
    name: "Burger Trufado",
    description: "Hambúrguer artesanal com queijo brie, cogumelos salteados e azeite trufado",
    price: 48.90,
    category: "lanches",
    image: imgTruffleBurger,
  },
  {
    id: "lanche-03",
    name: "Chicken Supreme",
    description: "Frango empanado crocante, maionese de ervas e salada fresca",
    price: 34.90,
    category: "lanches",
    image: imgChickenSupreme,
  },
  {
    id: "lanche-04",
    name: "Veggie Gourmet",
    description: "Hambúrguer de grão-de-bico, queijo coalho grelhado e molho tahine",
    price: 36.90,
    category: "lanches",
    image: imgVeggieBurger,
  },
  {
    id: "lanche-05",
    name: "Double Bacon",
    description: "Dois hambúrgueres, muito bacon, cheddar derretido e cebola caramelizada",
    price: 52.90,
    category: "lanches",
    image: imgDoubleBacon,
  },
  
  // ======================== PIZZAS ========================
  {
    id: "pizza-01",
    name: "Margherita Premium",
    description: "Molho de tomate San Marzano, mozzarella de búfala e manjericão fresco",
    price: 59.90,
    category: "pizzas",
    image: imgPizzaMargherita,
  },
  {
    id: "pizza-02",
    name: "Quattro Formaggi",
    description: "Gorgonzola, parmesão, mozzarella e provolone com mel trufado",
    price: 69.90,
    category: "pizzas",
    image: imgPizzaQuattro,
  },
  {
    id: "pizza-03",
    name: "Pepperoni Clássica",
    description: "Pepperoni artesanal, mozzarella e orégano importado",
    price: 62.90,
    category: "pizzas",
    image: imgPizzaPepperoni,
  },
  {
    id: "pizza-04",
    name: "Parma & Rúcula",
    description: "Presunto de Parma, rúcula selvagem, lascas de parmesão e azeite extra virgem",
    price: 74.90,
    category: "pizzas",
    image: imgPizzaParma,
  },
  {
    id: "pizza-05",
    name: "Calabresa Gold",
    description: "Calabresa artesanal, cebola roxa caramelizada e pimenta calabresa",
    price: 54.90,
    category: "pizzas",
    image: imgPizzaCalabresa,
  },
  
  // ======================== PORÇÕES ========================
  {
    id: "porcao-01",
    name: "Batata Rústica",
    description: "Batatas com casca, temperadas com alecrim e flor de sal",
    price: 28.90,
    category: "porcoes",
    image: imgBatataRustica,
  },
  {
    id: "porcao-02",
    name: "Onion Rings Premium",
    description: "Anéis de cebola empanados com farinha panko e maionese sriracha",
    price: 32.90,
    category: "porcoes",
    image: imgOnionRings,
  },
  {
    id: "porcao-03",
    name: "Nuggets Artesanais",
    description: "Nuggets de frango temperado com ervas finas",
    price: 34.90,
    category: "porcoes",
    image: imgNuggets,
  },
  {
    id: "porcao-04",
    name: "Mix de Aperitivos",
    description: "Seleção de polenta frita, bolinhos de queijo e croquetes",
    price: 45.90,
    category: "porcoes",
    image: imgMixAperitivos,
  },
  {
    id: "porcao-05",
    name: "Tábua de Frios",
    description: "Queijos selecionados, presuntos e antepastos com torradas",
    price: 68.90,
    category: "porcoes",
    image: imgTabuaFrios,
  },
  
  // ======================== BEBIDAS ========================
  {
    id: "bebida-01",
    name: "Refrigerante Lata",
    description: "Coca-Cola, Guaraná ou Sprite (350ml)",
    price: 7.90,
    category: "bebidas",
    image: imgRefrigerante,
  },
  {
    id: "bebida-02",
    name: "Suco Natural",
    description: "Laranja, limão ou maracujá (400ml)",
    price: 12.90,
    category: "bebidas",
    image: imgSucoNatural,
  },
  {
    id: "bebida-03",
    name: "Água Mineral",
    description: "Com ou sem gás (500ml)",
    price: 5.90,
    category: "bebidas",
    image: imgAguaMineral,
  },
  {
    id: "bebida-04",
    name: "Cerveja Premium",
    description: "Heineken, Budweiser ou Corona (long neck)",
    price: 14.90,
    category: "bebidas",
    image: imgCerveja,
  },
  {
    id: "bebida-05",
    name: "Milk Shake",
    description: "Chocolate, morango ou ovomaltine (400ml)",
    price: 18.90,
    category: "bebidas",
    image: imgMilkshake,
  },
];

/* -----------------------------------------------------------------------------
   FIM DA CONFIGURAÇÃO
   
   Lembre-se: Após modificar este arquivo, o cardápio será atualizado
   automaticamente com as novas informações.
   ----------------------------------------------------------------------------- */