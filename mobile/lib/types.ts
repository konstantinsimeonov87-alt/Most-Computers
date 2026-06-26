export interface Product {
  id: number;
  name: string;
  brand: string;
  cat: string;
  subcat: string;
  price: number;
  old?: number;
  pct?: number;
  badge?: 'sale' | 'new' | 'hot' | 'promo';
  added: string;
  emoji: string;
  sku: string;
  ean?: string;
  specs: Record<string, string>;
  rating: number;
  rv: number;
  desc?: string;
  img: string;
  stock: boolean;
  lowstock?: boolean;
}

export interface CartItem {
  id: number;
  qty: number;
}

export interface Order {
  id?: string;
  order_num: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_type: string;
  delivery_address?: string;
  payment_type: 'card' | 'cod' | 'bank';
  items: Array<{
    product_id: number;
    name: string;
    brand: string;
    emoji: string;
    price: number;
    qty: number;
  }>;
  subtotal: number;
  delivery_cost: number;
  total: number;
  promo_discount?: number;
  note?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  tracking_num?: string;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface CheckoutData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  deliveryType: 'econt_fast' | 'econt_std' | 'pickup';
  city: string;
  address: string;
  note: string;
  paymentType: 'card' | 'cod' | 'bank';
  promoCode: string;
  promoDiscount: number;
}

export const DELIVERY_OPTIONS = [
  { id: 'econt_fast', label: 'Еконт 2-3 дни', cost: 5.99 },
  { id: 'econt_std', label: 'Еконт 3+ дни', cost: 4.99 },
  { id: 'pickup', label: 'Вземи от магазин', cost: 0 },
] as const;

export const FREE_SHIPPING_THRESHOLD = 100;

export const CAT_LABELS: Record<string, string> = {
  components: 'Компоненти',
  laptops: 'Лаптопи',
  desktops: 'Компютри',
  peripherals: 'Периферия',
  monitors: 'Монитори',
  phones: 'Телефони',
  tablets: 'Таблети',
  audio: 'Аудио',
  cameras: 'Камери',
  network: 'Мрежа',
  storage: 'Съхранение',
  printers: 'Принтери',
  tvs: 'Телевизори',
  software: 'Софтуер',
  accessories: 'Аксесоари',
};

export const STATUS_INFO: Record<string, { label: string; color: string }> = {
  pending: { label: 'Изчакване', color: '#f59e0b' },
  processing: { label: 'Обработва се', color: '#3b82f6' },
  shipped: { label: 'Изпратена', color: '#8b5cf6' },
  delivered: { label: 'Доставена', color: '#16a34a' },
  cancelled: { label: 'Отказана', color: '#ef4444' },
};
