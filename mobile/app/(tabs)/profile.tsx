import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { formatEur } from '../../lib/currency';
import { STATUS_INFO, type Order } from '../../lib/types';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (user?.email) loadOrders();
  }, [user?.email]);

  async function loadOrders() {
    setLoadingOrders(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', user!.email)
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) setOrders(data as Order[]);
    setLoadingOrders(false);
  }

  function handleSignOut() {
    Alert.alert('Изход', 'Сигурни ли сте, че искате да излезете?', [
      { text: 'Отказ', style: 'cancel' },
      { text: 'Изход', style: 'destructive', onPress: signOut },
    ]);
  }

  const initials = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : '';

  if (!user) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Профил</Text>
        </View>
        <View style={styles.guestContainer}>
          <View style={styles.guestIcon}>
            <Ionicons name="person-outline" size={48} color={COLORS.gray300} />
          </View>
          <Text style={styles.guestTitle}>Влезте в акаунта си</Text>
          <Text style={styles.guestSub}>За да виждате поръчките и любимите си продукти</Text>
          <Pressable style={styles.loginBtn} onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginBtnText}>Вход</Text>
          </Pressable>
          <Pressable style={styles.registerBtn} onPress={() => router.push('/auth/register')}>
            <Text style={styles.registerBtnText}>Регистрация</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Профил</Text>
        <Pressable onPress={handleSignOut} hitSlop={8}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.white} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.firstName} {user.lastName}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            {user.phone && <Text style={styles.profilePhone}>{user.phone}</Text>}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Моите поръчки</Text>

        {loadingOrders ? (
          <Text style={styles.loadingText}>Зарежда...</Text>
        ) : orders.length === 0 ? (
          <View style={styles.noOrders}>
            <Ionicons name="receipt-outline" size={48} color={COLORS.gray200} />
            <Text style={styles.noOrdersText}>Нямате направени поръчки</Text>
          </View>
        ) : (
          orders.map((order) => {
            const st = STATUS_INFO[order.status] ?? { label: order.status, color: COLORS.gray500 };
            const itemCount = order.items.reduce((s: number, i: any) => s + i.qty, 0);
            return (
              <Pressable
                key={order.order_num}
                style={styles.orderCard}
                onPress={() => {}}
              >
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNum}>{order.order_num}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: `${st.color}20` }]}>
                    <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
                  </View>
                </View>
                <Text style={styles.orderDate}>
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString('bg-BG', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                      })
                    : '-'}
                </Text>
                <View style={styles.orderFooter}>
                  <Text style={styles.orderItems}>{itemCount} продукта</Text>
                  <Text style={styles.orderTotal}>{formatEur(order.total)}</Text>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.gray50 },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { color: COLORS.white, fontSize: FONTS.xl, fontWeight: '700' },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: 12,
    padding: 16,
    borderRadius: RADIUS.lg,
    gap: 14,
    ...SHADOW.sm,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: COLORS.white, fontSize: FONTS.xl, fontWeight: '700' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.black },
  profileEmail: { fontSize: FONTS.base, color: COLORS.gray500, marginTop: 2 },
  profilePhone: { fontSize: FONTS.sm, color: COLORS.gray400, marginTop: 2 },
  sectionTitle: {
    fontSize: FONTS.lg,
    fontWeight: '700',
    color: COLORS.black,
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 4,
  },
  loadingText: { textAlign: 'center', color: COLORS.gray400, padding: 20 },
  noOrders: { alignItems: 'center', padding: 32, gap: 8 },
  noOrdersText: { color: COLORS.gray400, fontSize: FONTS.base },
  orderCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: RADIUS.md,
    padding: 14,
    ...SHADOW.sm,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  orderNum: { fontSize: FONTS.base, fontWeight: '700', color: COLORS.black },
  statusBadge: { borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: FONTS.sm, fontWeight: '600' },
  orderDate: { fontSize: FONTS.sm, color: COLORS.gray400, marginBottom: 8 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  orderItems: { fontSize: FONTS.base, color: COLORS.gray500 },
  orderTotal: { fontSize: FONTS.base, fontWeight: '700', color: COLORS.primary },
  guestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 10,
    paddingBottom: 80,
  },
  guestIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  guestTitle: { fontSize: FONTS.xl, fontWeight: '700', color: COLORS.gray700 },
  guestSub: { fontSize: FONTS.base, color: COLORS.gray400, textAlign: 'center' },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: 48,
    paddingVertical: 13,
    marginTop: 16,
  },
  loginBtnText: { color: COLORS.white, fontSize: FONTS.md, fontWeight: '700' },
  registerBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: 48,
    paddingVertical: 12,
  },
  registerBtnText: { color: COLORS.primary, fontSize: FONTS.md, fontWeight: '600' },
});
