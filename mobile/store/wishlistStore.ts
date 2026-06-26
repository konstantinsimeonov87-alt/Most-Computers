import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'mc_wishlist';

interface WishlistState {
  ids: number[];
  load: (email?: string) => Promise<void>;
  toggle: (productId: number, email?: string) => void;
  has: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  ids: [],

  load: async (email) => {
    try {
      if (email) {
        const { data } = await supabase
          .from('wishlists')
          .select('product_ids')
          .eq('email', email)
          .single();
        if (data?.product_ids) {
          set({ ids: data.product_ids });
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data.product_ids));
          return;
        }
      }
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) set({ ids: JSON.parse(raw) });
    } catch (_) {}
  },

  toggle: (productId, email) => {
    const ids = get().ids;
    const updated = ids.includes(productId)
      ? ids.filter((id) => id !== productId)
      : [...ids, productId];
    set({ ids: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (email) {
      supabase
        .from('wishlists')
        .upsert({ email, product_ids: updated, updated_at: new Date().toISOString() });
    }
  },

  has: (productId) => get().ids.includes(productId),
}));
