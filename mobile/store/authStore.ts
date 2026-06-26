import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import type { User } from '../lib/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, firstName: string, lastName: string, phone: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  loadSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const meta = session.user.user_metadata ?? {};
        set({
          user: {
            id: session.user.id,
            email: session.user.email ?? '',
            firstName: meta.firstName ?? '',
            lastName: meta.lastName ?? '',
            phone: meta.phone ?? '',
          },
        });
      }
    } catch (_) {
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    if (data.user) {
      const meta = data.user.user_metadata ?? {};
      set({
        user: {
          id: data.user.id,
          email: data.user.email ?? '',
          firstName: meta.firstName ?? '',
          lastName: meta.lastName ?? '',
          phone: meta.phone ?? '',
        },
      });
    }
    return null;
  },

  signUp: async (email, password, firstName, lastName, phone) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { firstName, lastName, phone } },
    });
    if (error) return error.message;
    if (data.user) {
      set({
        user: {
          id: data.user.id,
          email: data.user.email ?? '',
          firstName,
          lastName,
          phone,
        },
      });
    }
    return null;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem('mc_cart');
    set({ user: null });
  },
}));
