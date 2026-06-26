import { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, Pressable, StyleSheet,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { getProductById } from '../../lib/products';
import { bgnToEur, formatEur } from '../../lib/currency';
import { DELIVERY_OPTIONS, FREE_SHIPPING_THRESHOLD } from '../../lib/types';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../constants/theme';

const STEPS = ['Данни', 'Доставка', 'Плащане'];

const PROMO_CODES: Record<string, number> = {
  MOSTCOMP10: 0.1,
};

export default function CheckoutScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { items, subtotalEur, clearCart } = useCartStore();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');

  const [deliveryIdx, setDeliveryIdx] = useState(0);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  const [payType, setPayType] = useState<'cod' | 'bank' | 'card'>('cod');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');

  const subtotal = subtotalEur();
  const deliveryOpt = DELIVERY_OPTIONS[deliveryIdx];
  const deliveryCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : deliveryOpt.cost;
  const discount = subtotal * promoDiscount;
  const total = subtotal + deliveryCost - discount;

  function applyPromo() {
    const pct = PROMO_CODES[promoCode.toUpperCase()];
    if (pct) {
      setPromoDiscount(pct);
      setPromoMsg(`Промокодът е приложен - ${pct * 100}% отстъпка!`);
    } else {
      setPromoDiscount(0);
      setPromoMsg('Невалиден промокод.');
    }
  }

  function validateStep0() {
    if (!firstName.trim() || !lastName.trim()) return 'Въведете имена';
    if (!email.includes('@')) return 'Невалиден имейл';
    if (phone.trim().length < 9) return 'Невалиден телефон';
    return null;
  }

  function validateStep1() {
    if (deliveryIdx !== 2 && !city.trim()) return 'Въведете град';
    if (deliveryIdx !== 2 && !address.trim()) return 'Въведете адрес';
    return null;
  }

  function goNext() {
    if (step === 0) {
      const err = validateStep0();
      if (err) { Alert.alert('Грешка', err); return; }
    }
    if (step === 1) {
      const err = validateStep1();
      if (err) { Alert.alert('Грешка', err); return; }
    }
    setStep((s) => Math.min(s + 1, 2));
  }

  async function submitOrder() {
    setLoading(true);
    try {
      const orderItems = items.map((ci) => {
        const p = getProductById(ci.id)!;
        return {
          product_id: p.id,
          name: p.name,
          brand: p.brand,
          emoji: p.emoji,
          price: bgnToEur(p.price),
          qty: ci.qty,
        };
      });

      const orderNum = `MC-${Date.now().toString().slice(-6)}`;
      const deliveryAddr = deliveryIdx === 2
        ? 'Вземи от магазин'
        : `${city}, ${address}`;

      const orderData = {
        order_num: orderNum,
        customer_name: `${firstName} ${lastName}`,
        customer_email: email,
        customer_phone: phone,
        delivery_type: deliveryOpt.label,
        delivery_address: deliveryAddr,
        payment_type: payType,
        items: orderItems,
        subtotal: Math.round(subtotal * 100) / 100,
        delivery_cost: deliveryCost,
        total: Math.round(total * 100) / 100,
        promo_discount: discount > 0 ? Math.round(discount * 100) / 100 : undefined,
        note: note || undefined,
        status: 'pending',
      };

      const { error } = await supabase.from('orders').insert(orderData);
      if (error) throw error;

      clearCart();
      Alert.alert(
        'Поръчката е приета!',
        `Номер: ${orderNum}\n\nЩе получите потвърждение на ${email}.`,
        [{ text: 'OK', onPress: () => router.replace('/') }]
      );
    } catch (err: any) {
      Alert.alert('Грешка', err.message ?? 'Моля опитайте отново.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.stepBar}>
        {STEPS.map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepDot, i <= step && styles.stepDotActive, i < step && styles.stepDotDone]}>
              {i < step
                ? <Ionicons name="checkmark" size={12} color={COLORS.white} />
                : <Text style={[styles.stepNum, i <= step && styles.stepNumActive]}>{i + 1}</Text>
              }
            </View>
            <Text style={[styles.stepLabel, i <= step && styles.stepLabelActive]}>{s}</Text>
            {i < STEPS.length - 1 && (
              <View style={[styles.stepLine, i < step && styles.stepLineDone]} />
            )}
          </View>
        ))}
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Step 0 - Customer info */}
          {step === 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Вашите данни</Text>
              <Row label="Име">
                <Input value={firstName} onChange={setFirstName} placeholder="Иван" />
              </Row>
              <Row label="Фамилия">
                <Input value={lastName} onChange={setLastName} placeholder="Иванов" />
              </Row>
              <Row label="Имейл">
                <Input value={email} onChange={setEmail} placeholder="ivan@example.com" keyboardType="email-address" />
              </Row>
              <Row label="Телефон">
                <Input value={phone} onChange={setPhone} placeholder="+359 888 123 456" keyboardType="phone-pad" />
              </Row>
            </View>
          )}

          {/* Step 1 - Delivery */}
          {step === 1 && (
            <>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Начин на доставка</Text>
                {DELIVERY_OPTIONS.map((opt, i) => (
                  <Pressable
                    key={opt.id}
                    style={[styles.radioRow, deliveryIdx === i && styles.radioRowActive]}
                    onPress={() => setDeliveryIdx(i)}
                  >
                    <View style={[styles.radio, deliveryIdx === i && styles.radioActive]}>
                      {deliveryIdx === i && <View style={styles.radioDot} />}
                    </View>
                    <Text style={styles.radioLabel}>{opt.label}</Text>
                    <Text style={[styles.radioCost, opt.cost === 0 && styles.freeCost]}>
                      {opt.cost === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
                        ? 'Безплатно'
                        : formatEur(opt.cost)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {deliveryIdx !== 2 && (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Адрес за доставка</Text>
                  <Row label="Град / Офис на Еконт">
                    <Input value={city} onChange={setCity} placeholder="София, офис Еконт..." />
                  </Row>
                  <Row label="Адрес">
                    <Input value={address} onChange={setAddress} placeholder="ул. Витоша 1, ет. 3" />
                  </Row>
                  <Row label="Бележка (незадължително)">
                    <Input value={note} onChange={setNote} placeholder="Допълнителни инструкции..." multiline />
                  </Row>
                </View>
              )}
            </>
          )}

          {/* Step 2 - Payment & review */}
          {step === 2 && (
            <>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Начин на плащане</Text>
                {([
                  { id: 'cod', label: 'Наложен платеж', icon: 'cash-outline' },
                  { id: 'bank', label: 'Банков превод', icon: 'business-outline' },
                  { id: 'card', label: 'Карта', icon: 'card-outline' },
                ] as const).map((opt) => (
                  <Pressable
                    key={opt.id}
                    style={[styles.radioRow, payType === opt.id && styles.radioRowActive]}
                    onPress={() => setPayType(opt.id)}
                  >
                    <Ionicons name={opt.icon as any} size={20} color={payType === opt.id ? COLORS.primary : COLORS.gray500} style={{ marginRight: 8 }} />
                    <Text style={styles.radioLabel}>{opt.label}</Text>
                    <View style={[styles.radio, payType === opt.id && styles.radioActive]}>
                      {payType === opt.id && <View style={styles.radioDot} />}
                    </View>
                  </Pressable>
                ))}
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Промокод</Text>
                <View style={styles.promoRow}>
                  <TextInput
                    style={styles.promoInput}
                    value={promoCode}
                    onChangeText={(t) => setPromoCode(t.toUpperCase())}
                    placeholder="MOSTCOMP10"
                    autoCapitalize="characters"
                  />
                  <Pressable style={styles.promoBtn} onPress={applyPromo}>
                    <Text style={styles.promoBtnText}>Приложи</Text>
                  </Pressable>
                </View>
                {!!promoMsg && (
                  <Text style={[styles.promoMsg, promoDiscount > 0 && styles.promoMsgOk]}>
                    {promoMsg}
                  </Text>
                )}
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Резюме</Text>
                {items.map((ci) => {
                  const p = getProductById(ci.id)!;
                  return (
                    <View key={ci.id} style={styles.summaryItem}>
                      <Text style={styles.summaryItemName} numberOfLines={1}>{p.emoji} {p.name}</Text>
                      <Text style={styles.summaryItemQty}>x{ci.qty}</Text>
                      <Text style={styles.summaryItemPrice}>{formatEur(bgnToEur(p.price) * ci.qty)}</Text>
                    </View>
                  );
                })}
                <View style={styles.divider} />
                <SumRow label="Продукти" value={formatEur(subtotal)} />
                <SumRow label={`Доставка (${deliveryOpt.label})`} value={deliveryCost === 0 ? 'Безплатна' : formatEur(deliveryCost)} />
                {promoDiscount > 0 && <SumRow label="Отстъпка" value={`-${formatEur(discount)}`} green />}
                <View style={styles.divider} />
                <SumRow label="Общо" value={formatEur(total)} bold />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        {step > 0 && (
          <Pressable style={styles.backBtn} onPress={() => setStep((s) => s - 1)}>
            <Ionicons name="arrow-back" size={18} color={COLORS.primary} />
            <Text style={styles.backBtnText}>Назад</Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.nextBtn, step === 0 && { flex: 1 }, loading && styles.nextBtnDisabled]}
          onPress={step < 2 ? goNext : submitOrder}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={COLORS.white} />
            : <>
                <Text style={styles.nextBtnText}>{step < 2 ? 'Напред' : 'Потвърди поръчката'}</Text>
                <Ionicons name={step < 2 ? 'arrow-forward' : 'checkmark-circle-outline'} size={18} color={COLORS.white} />
              </>
          }
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      {children}
    </View>
  );
}

function Input({ value, onChange, placeholder, keyboardType, multiline }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  keyboardType?: any; multiline?: boolean;
}) {
  return (
    <TextInput
      style={[styles.textInput, multiline && styles.textInputMulti]}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={COLORS.gray300}
      keyboardType={keyboardType}
      multiline={multiline}
      autoCapitalize="none"
    />
  );
}

function SumRow({ label, value, green, bold }: { label: string; value: string; green?: boolean; bold?: boolean }) {
  return (
    <View style={styles.sumRow}>
      <Text style={[styles.sumLabel, bold && styles.sumLabelBold]}>{label}</Text>
      <Text style={[styles.sumValue, green && styles.sumValueGreen, bold && styles.sumValueBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.gray50 },
  stepBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: { backgroundColor: COLORS.primary },
  stepDotDone: { backgroundColor: COLORS.green },
  stepNum: { fontSize: 11, fontWeight: '700', color: COLORS.gray500 },
  stepNumActive: { color: COLORS.white },
  stepLabel: { fontSize: FONTS.sm, color: COLORS.gray400, marginLeft: 5, marginRight: 8 },
  stepLabelActive: { color: COLORS.primary, fontWeight: '600' },
  stepLine: { width: 32, height: 2, backgroundColor: COLORS.gray200, marginRight: 8 },
  stepLineDone: { backgroundColor: COLORS.green },
  content: { padding: 16, paddingBottom: 24 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 12,
    ...SHADOW.sm,
  },
  cardTitle: { fontSize: FONTS.md, fontWeight: '700', color: COLORS.black, marginBottom: 14 },
  row: { marginBottom: 12 },
  rowLabel: { fontSize: FONTS.sm, color: COLORS.gray500, marginBottom: 5, fontWeight: '500' },
  textInput: {
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: FONTS.base,
    color: COLORS.black,
    backgroundColor: COLORS.gray50,
  },
  textInputMulti: { height: 80, textAlignVertical: 'top' },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    marginBottom: 8,
  },
  radioRowActive: { borderColor: COLORS.primary, backgroundColor: '#fff5f5' },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioActive: { borderColor: COLORS.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  radioLabel: { flex: 1, fontSize: FONTS.base, color: COLORS.black },
  radioCost: { fontSize: FONTS.base, color: COLORS.gray500 },
  freeCost: { color: COLORS.green, fontWeight: '600' },
  promoRow: { flexDirection: 'row', gap: 8 },
  promoInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: FONTS.base,
    color: COLORS.black,
  },
  promoBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  promoBtnText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.base },
  promoMsg: { marginTop: 6, fontSize: FONTS.sm, color: COLORS.primary },
  promoMsgOk: { color: COLORS.green },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryItemName: { flex: 1, fontSize: FONTS.sm, color: COLORS.gray700 },
  summaryItemQty: { fontSize: FONTS.sm, color: COLORS.gray500, marginHorizontal: 8 },
  summaryItemPrice: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.black },
  divider: { height: 1, backgroundColor: COLORS.gray100, marginVertical: 8 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  sumLabel: { fontSize: FONTS.base, color: COLORS.gray500 },
  sumLabelBold: { fontWeight: '700', color: COLORS.black },
  sumValue: { fontSize: FONTS.base, color: COLORS.black },
  sumValueGreen: { color: COLORS.green },
  sumValueBold: { fontWeight: '800', fontSize: FONTS.lg, color: COLORS.primary },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    ...SHADOW.lg,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtnText: { color: COLORS.primary, fontWeight: '600', fontSize: FONTS.base },
  nextBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
  },
  nextBtnDisabled: { opacity: 0.7 },
  nextBtnText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.md },
});
