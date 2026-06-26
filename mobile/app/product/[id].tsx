import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getProductById } from '../../lib/products';
import { productImageUrl, priceEur, bgnToEur } from '../../lib/currency';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../constants/theme';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const product = getProductById(Number(id));

  const addItem = useCartStore((s) => s.addItem);
  const toggle = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.has(Number(id)));
  const user = useAuthStore((s) => s.user);

  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Продуктът не е намерен</Text>
      </View>
    );
  }

  const discountPct = product.old
    ? Math.round(((product.old - product.price) / product.old) * 100)
    : product.pct;

  function handleAddToCart() {
    addItem(product!.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    addItem(product!.id);
    router.push('/cart');
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageSection}>
        <Image
          source={{ uri: productImageUrl(product.img) }}
          style={styles.image}
          contentFit="contain"
        />
        {discountPct ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>-{discountPct}%</Text>
          </View>
        ) : null}
        <Pressable
          style={styles.heartBtn}
          onPress={() => toggle(product.id, user?.email)}
        >
          <Ionicons
            name={inWishlist ? 'heart' : 'heart-outline'}
            size={24}
            color={inWishlist ? COLORS.primary : COLORS.gray500}
          />
        </Pressable>
      </View>

      <View style={styles.info}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name}>{product.name}</Text>

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>{priceEur(product.price)}</Text>
            {product.old && (
              <Text style={styles.oldPrice}>{bgnToEur(product.old).toFixed(2)} €</Text>
            )}
          </View>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#f59e0b" />
            <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={[styles.stockBadge, !product.stock && styles.stockBadgeOut]}>
          <Ionicons
            name={product.stock ? 'checkmark-circle' : 'close-circle'}
            size={14}
            color={product.stock ? COLORS.green : COLORS.primary}
          />
          <Text style={[styles.stockText, !product.stock && styles.stockTextOut]}>
            {product.lowstock ? 'Ограничено количество' : product.stock ? 'В наличност' : 'Изчерпан'}
          </Text>
        </View>

        <Text style={styles.sku}>SKU: {product.sku}</Text>

        {product.desc && (
          <View style={styles.descSection}>
            <Text style={styles.sectionTitle}>Описание</Text>
            <Text style={styles.desc}>{product.desc}</Text>
          </View>
        )}

        <View style={styles.specsSection}>
          <Text style={styles.sectionTitle}>Технически характеристики</Text>
          {Object.entries(product.specs).map(([key, val]) => (
            <View key={key} style={styles.specRow}>
              <Text style={styles.specKey}>{key}</Text>
              <Text style={styles.specVal}>{val}</Text>
            </View>
          ))}
        </View>

        <View style={styles.btns}>
          <Pressable
            style={[styles.addBtn, !product.stock && styles.addBtnDisabled]}
            onPress={handleAddToCart}
            disabled={!product.stock}
          >
            <Ionicons name={added ? 'checkmark' : 'cart-outline'} size={20} color={COLORS.white} />
            <Text style={styles.addBtnText}>{added ? 'Добавено!' : 'Добави в количка'}</Text>
          </Pressable>
          <Pressable
            style={[styles.buyBtn, !product.stock && styles.addBtnDisabled]}
            onPress={handleBuyNow}
            disabled={!product.stock}
          >
            <Text style={styles.buyBtnText}>Купи сега</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { color: COLORS.gray500, fontSize: FONTS.md },
  imageSection: {
    backgroundColor: COLORS.gray50,
    aspectRatio: 1,
    position: 'relative',
  },
  image: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.base },
  heartBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.full,
    padding: 8,
    ...SHADOW.md,
  },
  info: { padding: 20 },
  brand: { fontSize: FONTS.base, color: COLORS.gray500, marginBottom: 4 },
  name: { fontSize: FONTS['2xl'], fontWeight: '700', color: COLORS.black, lineHeight: 32, marginBottom: 12 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 },
  price: { fontSize: FONTS['3xl'], color: COLORS.primary, fontWeight: '800' },
  oldPrice: { fontSize: FONTS.md, color: COLORS.gray400, textDecorationLine: 'line-through' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.gray700 },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.greenLight,
    alignSelf: 'flex-start',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 8,
  },
  stockBadgeOut: { backgroundColor: '#fee2e2' },
  stockText: { fontSize: FONTS.sm, color: COLORS.green, fontWeight: '600' },
  stockTextOut: { color: COLORS.primary },
  sku: { fontSize: FONTS.sm, color: COLORS.gray400, marginBottom: 20 },
  descSection: { marginBottom: 20 },
  sectionTitle: { fontSize: FONTS.lg, fontWeight: '700', color: COLORS.black, marginBottom: 10 },
  desc: { fontSize: FONTS.base, color: COLORS.gray700, lineHeight: 22 },
  specsSection: { marginBottom: 20 },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  specKey: { fontSize: FONTS.base, color: COLORS.gray500, flex: 1 },
  specVal: { fontSize: FONTS.base, color: COLORS.black, fontWeight: '500', flex: 1, textAlign: 'right' },
  btns: { gap: 10, marginTop: 8 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
  },
  addBtnDisabled: { backgroundColor: COLORS.gray300 },
  addBtnText: { color: COLORS.white, fontSize: FONTS.md, fontWeight: '700' },
  buyBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 13,
  },
  buyBtnText: { color: COLORS.primary, fontSize: FONTS.md, fontWeight: '700' },
});
