import { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, FlatList, Pressable, StyleSheet,
  StatusBar, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../../components/ProductCard';
import { PRODUCTS, getFeaturedProducts, getSaleProducts, getProductsByCategory } from '../../lib/products';
import { CAT_LABELS } from '../../lib/types';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../constants/theme';

const CATS = [
  { id: 'all', label: 'Всички', emoji: '🛍' },
  { id: 'sale', label: 'Промоции', emoji: '🔥' },
  { id: 'laptops', label: 'Лаптопи', emoji: '💻' },
  { id: 'components', label: 'Компоненти', emoji: '🔧' },
  { id: 'phones', label: 'Телефони', emoji: '📱' },
  { id: 'monitors', label: 'Монитори', emoji: '🖥' },
  { id: 'peripherals', label: 'Периферия', emoji: '⌨' },
  { id: 'tablets', label: 'Таблети', emoji: '📟' },
  { id: 'audio', label: 'Аудио', emoji: '🎧' },
  { id: 'tvs', label: 'Телевизори', emoji: '📺' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState('all');

  const products = useMemo(() => {
    const list = getProductsByCategory(activeCat);
    return list.filter((p) => p.stock);
  }, [activeCat]);

  const saleProducts = useMemo(() => getSaleProducts(), []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.logo}>Most Computers</Text>
        <Pressable onPress={() => router.push('/search')} style={styles.headerSearchBtn}>
          <Ionicons name="search-outline" size={22} color={COLORS.white} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catsRow}
        >
          {CATS.map((c) => (
            <Pressable
              key={c.id}
              style={[styles.catChip, activeCat === c.id && styles.catChipActive]}
              onPress={() => setActiveCat(c.id)}
            >
              <Text style={styles.catEmoji}>{c.emoji}</Text>
              <Text style={[styles.catLabel, activeCat === c.id && styles.catLabelActive]}>
                {c.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Sale banner */}
        {activeCat === 'all' && saleProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔥 Промоции</Text>
              <Pressable onPress={() => setActiveCat('sale')}>
                <Text style={styles.sectionMore}>Виж всички</Text>
              </Pressable>
            </View>
            <FlatList
              data={saleProducts}
              keyExtractor={(p) => String(p.id)}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.hCard}>
                  <ProductCard product={item} />
                </View>
              )}
              contentContainerStyle={styles.hList}
            />
          </View>
        )}

        {/* Product grid */}
        <View style={styles.section}>
          {activeCat === 'all' && (
            <Text style={styles.sectionTitle}>Всички продукти</Text>
          )}
          <View style={styles.grid}>
            {products.map((p) => (
              <View key={p.id} style={styles.gridItem}>
                <ProductCard product={p} />
              </View>
            ))}
          </View>
          {products.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Няма продукти в тази категория</Text>
            </View>
          )}
        </View>
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
  logo: {
    color: COLORS.white,
    fontSize: FONTS.xl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSearchBtn: {
    padding: 4,
  },
  catsRow: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 4,
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    ...SHADOW.sm,
  },
  catChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  catEmoji: { fontSize: 14 },
  catLabel: {
    fontSize: FONTS.sm,
    color: COLORS.gray700,
    fontWeight: '500',
  },
  catLabelActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: FONTS.lg,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 10,
  },
  sectionMore: {
    fontSize: FONTS.base,
    color: COLORS.primary,
    fontWeight: '600',
  },
  hList: { paddingRight: 12 },
  hCard: { width: 180 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  gridItem: { width: '50%' },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: COLORS.gray400,
    fontSize: FONTS.base,
  },
});
