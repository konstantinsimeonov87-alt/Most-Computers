import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProductById } from '../lib/products';
import { bgnToEur } from '../lib/currency';
import type { CartItem } from '../lib/types';

const STORAGE_KEY = 'mc_cart';

interface CartState {
  items: CartItem[];
  loaded: boolean;
  load: () => Promise<void>;
  addItem: (productId: number) => void;
  removeItem: (productId: number) => void;
  changeQty: (productId: number, delta: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotalEur: () => number;
}

function saveItems(items: CartItem[]) {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) set({ items: JSON.parse(raw) });
    } catch (_) {}
    set({ loaded: true });
  },

  addItem: (productId) => {
    const items = get().items;
    const existing = items.find((i) => i.id === productId);
    let updated: CartItem[];
    if (existing) {
      updated = items.map((i) => (i.id === productId ? { ...i, qty: i.qty + 1 } : i));
    } else {
      updated = [...items, { id: productId, qty: 1 }];
    }
    set({ items: updated });
    saveItems(updated);
  },

  removeItem: (productId) => {
    const updated = get().items.filter((i) => i.id !== productId);
    set({ items: updated });
    saveItems(updated);
  },

  changeQty: (productId, delta) => {
    const items = get().items;
    const updated = items
      .map((i) => (i.id === productId ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
      .filter((i) => i.qty > 0);
    set({ items: updated });
    saveItems(updated);
  },

  clearCart: () => {
    set({ items: [] });
    AsyncStorage.removeItem(STORAGE_KEY);
  },

  totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

  subtotalEur: () =>
    get().items.reduce((sum, i) => {
      const p = getProductById(i.id);
      return sum + (p ? bgnToEur(p.price) * i.qty : 0);
    }, 0),
}));
