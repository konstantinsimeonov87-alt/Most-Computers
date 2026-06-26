import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { COLORS } from '../constants/theme';

export default function RootLayout() {
  const loadSession  = useAuthStore((s) => s.loadSession);
  const user         = useAuthStore((s) => s.user);
  const loadCart     = useCartStore((s) => s.load);
  const loadWishlist = useWishlistStore((s) => s.load);

  useEffect(() => {
    loadSession();
    loadCart();
  }, []);

  useEffect(() => {
    if (user) loadWishlist(user.email);
    else loadWishlist();
  }, [user?.email]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[id]"
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackTitle: 'Назад',
            headerTintColor: COLORS.primary,
            headerStyle: { backgroundColor: COLORS.white },
          }}
        />
        <Stack.Screen
          name="auth/login"
          options={{
            headerShown: true,
            headerTitle: 'Вход',
            headerTintColor: COLORS.primary,
            headerStyle: { backgroundColor: COLORS.white },
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="auth/register"
          options={{
            headerShown: true,
            headerTitle: 'Регистрация',
            headerTintColor: COLORS.primary,
            headerStyle: { backgroundColor: COLORS.white },
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="checkout/index"
          options={{
            headerShown: true,
            headerTitle: 'Поръчка',
            headerTintColor: COLORS.primary,
            headerStyle: { backgroundColor: COLORS.white },
          }}
        />
        <Stack.Screen
          name="orders/[id]"
          options={{
            headerShown: true,
            headerTitle: 'Поръчка',
            headerTintColor: COLORS.primary,
            headerStyle: { backgroundColor: COLORS.white },
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
