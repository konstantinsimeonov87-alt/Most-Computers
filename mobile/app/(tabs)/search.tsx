import { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../../components/ProductCard';
import { searchProducts } from '../../lib/products';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../constants/theme';

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => searchProducts(query), [query]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Търсене</Text>
      </View>
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={COLORS.gray400} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Търсете продукт, марка, SKU..."
          placeholderTextColor={COLORS.gray400}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          clearButtonMode="while-editing"
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={COLORS.gray400} />
          </Pressable>
        )}
      </View>

      {query.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="search" size={56} color={COLORS.gray200} />
          <Text style={styles.emptyTitle}>Намерете продукта, който търсите</Text>
          <Text style={styles.emptySubtitle}>Въведете най-малко 2 символа</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="sad-outline" size={56} color={COLORS.gray200} />
          <Text style={styles.emptyTitle}>Няма резултати за "{query}"</Text>
          <Text style={styles.emptySubtitle}>Опитайте с друга дума или проверете правописа</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(p) => String(p.id)}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <ProductCard product={item} />
            </View>
          )}
          ListHeaderComponent={
            <Text style={styles.resultsCount}>
              {results.length} резултата за "{query}"
            </Text>
          }
          showsVerticalScrollIndicator={false}
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
  title: {
    color: COLORS.white,
    fontSize: FONTS.xl,
    fontWeight: '700',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: 12,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...SHADOW.sm,
  },
  searchIcon: { marginRight: 8 },
  input: {
    flex: 1,
    fontSize: FONTS.base,
    color: COLORS.black,
  },
  resultsCount: {
    fontSize: FONTS.sm,
    color: COLORS.gray500,
    paddingHorizontal: 6,
    marginBottom: 4,
  },
  list: { paddingHorizontal: 6, paddingBottom: 20 },
  item: { width: '50%' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 80,
  },
  emptyTitle: {
    fontSize: FONTS.md,
    color: COLORS.gray700,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  emptySubtitle: {
    fontSize: FONTS.base,
    color: COLORS.gray400,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
