import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { formatEur } from '../../lib/currency';
import { STATUS_INFO, type Order } from '../../lib/types';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../constants/theme';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('orders')
      .select('*')
      .eq('order_num', id)
      .single()
      .then(({ data }) => {
        setOrder(data as Order);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Поръчката не е намерена</Text>
      </View>
    );
  }

  const st = STATUS_INFO[order.status] ?? { label: order.status, color: COLORS.gray500 };
  const itemCount = order.items.reduce((s: number, i: any) => s + i.qty, 0);

  const TIMELINE = ['pending','processing','shipped','delivered'];
  const stepIdx  = TIMELINE.indexOf(order.status);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.card}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderNum}>{order.order_num}</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${st.color}20` }]}>
            <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
          </View>
        </View>
        {order.created_at && (
          <Text style={styles.date}>
            {new Date(order.created_at).toLocaleDateString('bg-BG', {
              day: '2-digit', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </Text>
        )}
      </View>

      {/* Timeline */}
      {order.status !== 'cancelled' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Статус</Text>
          <View style={styles.timeline}>
            {[
              { key: 'pending',    label: 'Приета',       icon: 'checkmark-circle-outline' },
              { key: 'processing', label: 'Обработва се', icon: 'cog-outline' },
              { key: 'shipped',    label: 'Изпратена',    icon: 'cube-outline' },
              { key: 'delivered',  label: 'Доставена',    icon: 'home-outline' },
            ].map((step, i) => {
              const done   = i <= stepIdx;
              const active = i === stepIdx;
              return (
                <View key={step.key} style={styles.timelineStep}>
                  <View style={[styles.timelineDot, done && styles.timelineDotDone, active && styles.timelineDotActive]}>
                    <Ionicons
                      name={step.icon as any}
                      size={14}
                      color={done ? COLORS.white : COLORS.gray300}
                    />
                  </View>
                  {i < 3 && (
                    <View style={[styles.timelineLine, i < stepIdx && styles.timelineLineDone]} />
                  )}
                  <Text style={[styles.timelineLabel, done && styles.timelineLabelDone]}>
                    {step.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Items */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Продукти ({itemCount})</Text>
        {order.items.map((item: any, i: number) => (
          <View key={i} style={styles.item}>
            <Text style={styles.itemEmoji}>{item.emoji}</Text>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemBrand}>{item.brand}</Text>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemQty}>x{item.qty}</Text>
              <Text style={styles.itemPrice}>{formatEur(item.price * item.qty)}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Delivery */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Доставка</Text>
        <Row icon="car-outline"    label={order.delivery_type} />
        {order.delivery_address && (
          <Row icon="location-outline" label={order.delivery_address} />
        )}
        {order.tracking_num && (
          <Row icon="barcode-outline"  label={`Проследяване: ${order.tracking_num}`} />
        )}
        {order.note && (
          <Row icon="chatbubble-outline" label={order.note} />
        )}
      </View>

      {/* Payment */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Плащане</Text>
        <Row
          icon="card-outline"
          label={{ card: 'Карта', cod: 'Наложен платеж', bank: 'Банков превод' }[order.payment_type] ?? order.payment_type}
        />
      </View>

      {/* Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Сума</Text>
        <SumRow label="Продукти"  value={formatEur(order.subtotal)} />
        <SumRow label="Доставка"  value={order.delivery_cost === 0 ? 'Безплатна' : formatEur(order.delivery_cost)} />
        {order.promo_discount && order.promo_discount > 0 && (
          <SumRow label="Отстъпка" value={`-${formatEur(order.promo_discount)}`} green />
        )}
        <View style={styles.divider} />
        <SumRow label="Общо" value={formatEur(order.total)} bold />
      </View>
    </ScrollView>
  );
}

function Row({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon as any} size={16} color={COLORS.gray400} />
      <Text style={styles.rowText}>{label}</Text>
    </View>
  );
}

function SumRow({ label, value, green, bold }: { label: string; value: string; green?: boolean; bold?: boolean }) {
  return (
    <View style={styles.sumRow}>
      <Text style={[styles.sumLabel, bold && styles.sumBold]}>{label}</Text>
      <Text style={[styles.sumValue, green && { color: COLORS.green }, bold && styles.sumBold, bold && { color: COLORS.primary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  content:   { padding: 12, paddingBottom: 32 },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound:  { color: COLORS.gray400, fontSize: FONTS.md },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 10,
    ...SHADOW.sm,
  },
  cardTitle: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.black, marginBottom: 12 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  orderNum:    { fontSize: FONTS.xl, fontWeight: '800', color: COLORS.black },
  statusBadge: { borderRadius: RADIUS.sm, paddingHorizontal: 10, paddingVertical: 4 },
  statusText:  { fontSize: FONTS.sm, fontWeight: '700' },
  date:        { fontSize: FONTS.sm, color: COLORS.gray400 },
  timeline: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  timelineStep: { alignItems: 'center', flex: 1 },
  timelineDot: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.gray200,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 1,
  },
  timelineDotDone:   { backgroundColor: COLORS.green },
  timelineDotActive: { backgroundColor: COLORS.primary },
  timelineLine: {
    position: 'absolute',
    top: 16, left: '50%', right: '-50%',
    height: 2,
    backgroundColor: COLORS.gray200,
  },
  timelineLineDone: { backgroundColor: COLORS.green },
  timelineLabel:     { fontSize: 10, color: COLORS.gray400, marginTop: 6, textAlign: 'center' },
  timelineLabelDone: { color: COLORS.black, fontWeight: '600' },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.gray100 },
  itemEmoji: { fontSize: 24, marginRight: 10 },
  itemInfo:  { flex: 1 },
  itemName:  { fontSize: FONTS.base, fontWeight: '600', color: COLORS.black, lineHeight: 20 },
  itemBrand: { fontSize: FONTS.sm, color: COLORS.gray400, marginTop: 2 },
  itemRight: { alignItems: 'flex-end', marginLeft: 8 },
  itemQty:   { fontSize: FONTS.sm, color: COLORS.gray400 },
  itemPrice: { fontSize: FONTS.base, fontWeight: '700', color: COLORS.black },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  rowText: { fontSize: FONTS.base, color: COLORS.gray700, flex: 1 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  sumLabel:  { fontSize: FONTS.base, color: COLORS.gray500 },
  sumValue:  { fontSize: FONTS.base, color: COLORS.black },
  sumBold:   { fontWeight: '800', fontSize: FONTS.lg },
  divider:   { height: 1, backgroundColor: COLORS.gray100, marginVertical: 6 },
});
