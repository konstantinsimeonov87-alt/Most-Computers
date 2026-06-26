import { View, Text, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';
import { getProductById } from '../../lib/products';
import { productImageUrl, priceEur, bgnToEur, formatEur } from '../../lib/currency';
import { FREE_SHIPPING_THRESHOLD, DELIVERY_OPTIONS } from '../../lib/types';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../constants/theme';

export default function CartScreen() {
  const router = useRouter();
  const { items, removeItem, changeQty, subtotalEur, clearCart } = useCartStore();

  const subtotal = subtotalEur();
  const deliveryCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_OPTIONS[0].cost;
  const total = subtotal + deliveryCost;
  const freeShippingLeft = FREE_SHIPPING_THRESHOLD - subtotal;

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Количка</Text>
        </View>
        <View style={styles.empty}>
          <Ionicons name="cart-outline" size={72} color={COLORS.gray200} />
          <Text style={styles.emptyTitle}>Количката е празна</Text>
          <Text style={styles.emptySub}>Добавете продукти, за да направите поръчка</Text>
          <Pressable style={styles.shopBtn} onPress={() => router.push('/')}>
            <Text style={styles.shopBtnText}>Разгледай продукти</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Количка ({items.length})</Text>
        <Pressable
          onPress={() => Alert.alert('Изчисти количката', 'Сигурни ли сте?', [
            { text: 'Отказ', style: 'cancel' },
            { text: 'Изчисти', style: 'destructive', onPress: clearCart },
          ])}
          hitSlop={8}
        >
          <Text style={styles.clearBtn}>Изчисти</Text>
        </Pressable>
      </View>

      {freeShippingLeft > 0 && (
        <View style={styles.freeShipBanner}>
          <Ionicons name="gift-outline" size={16} color={COLORS.green} />
          <Text style={styles.freeShipText}>
            Добавете още {formatEur(freeShippingLeft)} за безплатна доставка!
          </Text>
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const p = getProductById(item.id);
          if (!p) return null;
          const eurPrice = bgnToEur(p.price);
          return (
            <View style={styles.cartItem}>
              <Image
                source={{ uri: productImageUrl(p.img) }}
                style={styles.itemImage}
                contentFit="contain"
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemBrand}>{p.brand}</Text>
                <Text style={styles.itemName} numberOfLines={2}>{p.name}</Text>
                <Text style={styles.itemPrice}>{formatEur(eurPrice * item.qty)}</Text>
                {item.qty > 1 && (
                  <Text style={styles.itemUnit}>{formatEur(eurPrice)} / бр.</Text>
                )}
              </View>
              <View style={styles.qtySection}>
                <Pressable
                  style={styles.qtyBtn}
                  onPress={() => changeQty(item.id, -1)}
                >
                  <Ionicons name="remove" size={16} color={COLORS.primary} />
                </Pressable>
                <Text style={styles.qtyText}>{item.qty}</Text>
                <Pressable
                  style={styles.qtyBtn}
                  onPress={() => changeQty(item.id, 1)}
                >
                  <Ionicons name="add" size={16} color={COLORS.primary} />
                </Pressable>
                <Pressable
                  style={styles.removeBtn}
                  onPress={() => removeItem(item.id)}
                  hitSlop={8}
                >
                  <Ionicons name="trash-outline" size={16} color={COLORS.gray400} />
                </Pressable>
              </View>
            </View>
          );
        }}
        ListFooterComponent={
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Продукти</Text>
              <Text style={styles.summaryValue}>{formatEur(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Доставка</Text>
              <Text style={[styles.summaryValue, deliveryCost === 0 && styles.freeText]}>
                {deliveryCost === 0 ? 'Безплатна' : formatEur(deliveryCost)}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Общо</Text>
              <Text style={styles.totalValue}>{formatEur(total)}</Text>
            </View>
          </View>
        }
      />

      <View style={styles.checkoutBar}>
        <View>
          <Text style={styles.checkoutTotal}>{formatEur(total)}</Text>
          <Text style={styles.checkoutItems}>{items.reduce((s, i) => s + i.qty, 0)} продукта</Text>
        </View>
        <Pressable
          style={styles.checkoutBtn}
          onPress={() => router.push('/checkout')}
        >
          <Text style={styles.checkoutBtnText}>Поръчай</Text>
          <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
        </Pressable>
      </View>
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
  clearBtn: { color: 'rgba(255,255,255,0.8)', fontSize: FONTS.base },
  freeShipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.greenLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  freeShipText: { fontSize: FONTS.sm, color: COLORS.green, fontWeight: '500', flex: 1 },
  list: { padding: 12, paddingBottom: 100 },
  cartItem: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    padding: 12,
    marginBottom: 8,
    ...SHADOW.sm,
  },
  itemImage: { width: 72, height: 72, borderRadius: RADIUS.sm, marginRight: 12 },
  itemInfo: { flex: 1, justifyContent: 'center' },
  itemBrand: { fontSize: FONTS.sm, color: COLORS.gray500 },
  itemName: { fontSize: FONTS.base, fontWeight: '600', color: COLORS.black, marginVertical: 2, lineHeight: 20 },
  itemPrice: { fontSize: FONTS.md, color: COLORS.primary, fontWeight: '700' },
  itemUnit: { fontSize: FONTS.sm, color: COLORS.gray400 },
  qtySection: { alignItems: 'center', gap: 6 },
  qtyBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    padding: 4,
  },
  qtyText: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.black, minWidth: 24, textAlign: 'center' },
  removeBtn: { marginTop: 4 },
  summary: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 16,
    marginTop: 4,
    ...SHADOW.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: { fontSize: FONTS.base, color: COLORS.gray500 },
  summaryValue: { fontSize: FONTS.base, color: COLORS.black, fontWeight: '500' },
  freeText: { color: COLORS.green, fontWeight: '600' },
  totalRow: { borderTopWidth: 1, borderTopColor: COLORS.gray100, marginTop: 6, paddingTop: 12 },
  totalLabel: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.black },
  totalValue: { fontSize: FONTS.xl, fontWeight: '800', color: COLORS.primary },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    ...SHADOW.lg,
  },
  checkoutTotal: { fontSize: FONTS.xl, fontWeight: '800', color: COLORS.black },
  checkoutItems: { fontSize: FONTS.sm, color: COLORS.gray500 },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  checkoutBtnText: { color: COLORS.white, fontSize: FONTS.md, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingBottom: 80 },
  emptyTitle: { fontSize: FONTS.xl, fontWeight: '700', color: COLORS.gray700 },
  emptySub: { fontSize: FONTS.base, color: COLORS.gray400, textAlign: 'center', paddingHorizontal: 32 },
  shopBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 16,
  },
  shopBtnText: { color: COLORS.white, fontSize: FONTS.md, fontWeight: '700' },
});
