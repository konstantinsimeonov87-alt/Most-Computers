import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { Product } from '../lib/types';
import { productImageUrl, priceEur, bgnToEur } from '../lib/currency';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import { COLORS, FONTS, RADIUS, SHADOW } from '../constants/theme';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const toggle = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.has(product.id));
  const user = useAuthStore((s) => s.user);

  const discountPct = product.old
    ? Math.round(((product.old - product.price) / product.old) * 100)
    : product.pct;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
      onPress={() => router.push(`/product/${product.id}`)}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: productImageUrl(product.img) }}
          style={styles.image}
          contentFit="contain"
          transition={200}
        />
        {discountPct ? (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discountPct}%</Text>
          </View>
        ) : product.badge === 'new' ? (
          <View style={[styles.discountBadge, styles.newBadge]}>
            <Text style={styles.discountText}>НОВО</Text>
          </View>
        ) : null}
        <Pressable
          style={styles.heartBtn}
          onPress={() => toggle(product.id, user?.email)}
          hitSlop={8}
        >
          <Ionicons
            name={inWishlist ? 'heart' : 'heart-outline'}
            size={20}
            color={inWishlist ? COLORS.primary : COLORS.gray400}
          />
        </Pressable>
      </View>
      <View style={styles.info}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>{priceEur(product.price)}</Text>
            {product.old && (
              <Text style={styles.oldPrice}>{bgnToEur(product.old).toFixed(2)} €</Text>
            )}
          </View>
          {product.stock ? (
            <Pressable
              style={styles.addBtn}
              onPress={() => addItem(product.id)}
              hitSlop={6}
            >
              <Ionicons name="cart-outline" size={18} color={COLORS.white} />
            </Pressable>
          ) : (
            <View style={[styles.addBtn, styles.addBtnDisabled]}>
              <Ionicons name="close" size={18} color={COLORS.gray400} />
            </View>
          )}
        </View>
        {!product.stock && (
          <Text style={styles.outOfStock}>Изчерпан</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    flex: 1,
    margin: 6,
    ...SHADOW.sm,
  },
  imageWrap: {
    backgroundColor: COLORS.gray50,
    aspectRatio: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newBadge: {
    backgroundColor: COLORS.blue,
  },
  discountText: {
    color: COLORS.white,
    fontSize: FONTS.sm,
    fontWeight: '700',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.full,
    padding: 4,
    ...SHADOW.sm,
  },
  info: {
    padding: 10,
  },
  brand: {
    fontSize: FONTS.sm,
    color: COLORS.gray500,
    marginBottom: 2,
  },
  name: {
    fontSize: FONTS.base,
    color: COLORS.black,
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: FONTS.md,
    color: COLORS.primary,
    fontWeight: '700',
  },
  oldPrice: {
    fontSize: FONTS.sm,
    color: COLORS.gray400,
    textDecorationLine: 'line-through',
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    padding: 7,
  },
  addBtnDisabled: {
    backgroundColor: COLORS.gray100,
  },
  outOfStock: {
    fontSize: FONTS.sm,
    color: COLORS.gray400,
    marginTop: 4,
  },
});
