import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../../components/ProductCard';
import { useWishlistStore } from '../../store/wishlistStore';
import { getProductById } from '../../lib/products';
import { COLORS, FONTS, RADIUS } from '../../constants/theme';

export default function WishlistScreen() {
  const router = useRouter();
  const ids = useWishlistStore((s) => s.ids);
  const toggle = useWishlistStore((s) => s.toggle);

  const products = ids.map((id) => getProductById(id)).filter(Boolean) as ReturnType<typeof getProductById>[];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Любими {ids.length > 0 ? `(${ids.length})` : ''}</Text>
      </View>

      {ids.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={72} color={COLORS.gray200} />
          <Text style={styles.emptyTitle}>Нямате запазени продукти</Text>
          <Text style={styles.emptySub}>Натиснете сърцето до продукт, за да го запазите</Text>
          <Pressable style={styles.shopBtn} onPress={() => router.push('/')}>
            <Text style={styles.shopBtnText}>Разгледай продукти</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(p) => String(p!.id)}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <ProductCard product={item!} />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.gray50 },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: { color: COLORS.white, fontSize: FONTS.xl, fontWeight: '700' },
  list: { padding: 6, paddingBottom: 20 },
  item: { width: '50%' },
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
