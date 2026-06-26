import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { COLORS, FONTS, RADIUS, SHADOW } from '../../constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const signUp = useAuthStore((s) => s.signUp);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Грешка', 'Въведете имена.'); return;
    }
    if (!email.includes('@')) {
      Alert.alert('Грешка', 'Невалиден имейл.'); return;
    }
    if (password.length < 6) {
      Alert.alert('Грешка', 'Паролата трябва да е поне 6 символа.'); return;
    }
    setLoading(true);
    const err = await signUp(email.trim(), password, firstName.trim(), lastName.trim(), phone.trim());
    setLoading(false);
    if (err) {
      Alert.alert('Грешка при регистрация', err);
    } else {
      Alert.alert('Успех!', 'Акаунтът е създаден.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.logo}>
          <Text style={styles.logoText}>Most Computers</Text>
          <Text style={styles.logoSub}>Нов акаунт</Text>
        </View>

        <View style={styles.card}>
          {[
            { label: 'Име', value: firstName, set: setFirstName, placeholder: 'Иван', type: undefined },
            { label: 'Фамилия', value: lastName, set: setLastName, placeholder: 'Иванов', type: undefined },
            { label: 'Телефон', value: phone, set: setPhone, placeholder: '+359 888 123 456', type: 'phone-pad' as const },
            { label: 'Имейл', value: email, set: setEmail, placeholder: 'ivan@example.com', type: 'email-address' as const },
          ].map((f) => (
            <View key={f.label} style={styles.field}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                style={styles.input}
                value={f.value}
                onChangeText={f.set}
                placeholder={f.placeholder}
                placeholderTextColor={COLORS.gray300}
                keyboardType={f.type}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          ))}

          <View style={styles.field}>
            <Text style={styles.label}>Парола</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.inputFlex}
                value={password}
                onChangeText={setPassword}
                placeholder="Мин. 6 символа"
                placeholderTextColor={COLORS.gray300}
                secureTextEntry={!showPass}
              />
              <Pressable onPress={() => setShowPass((v) => !v)} hitSlop={8}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.gray400} />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={COLORS.white} />
              : <Text style={styles.submitBtnText}>Регистрация</Text>
            }
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Вече имате акаунт?</Text>
          <Pressable onPress={() => router.replace('/auth/login')}>
            <Text style={styles.footerLink}> Влезте</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: COLORS.gray50 },
  logo: { alignItems: 'center', marginBottom: 32, marginTop: 16 },
  logoText: { fontSize: FONTS['2xl'], fontWeight: '800', color: COLORS.primary },
  logoSub: { fontSize: FONTS.base, color: COLORS.gray500, marginTop: 4 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 20, ...SHADOW.md },
  field: { marginBottom: 14 },
  label: { fontSize: FONTS.sm, color: COLORS.gray700, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: FONTS.base,
    color: COLORS.black,
    backgroundColor: COLORS.gray50,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    backgroundColor: COLORS.gray50,
  },
  inputFlex: { flex: 1, paddingVertical: 11, fontSize: FONTS.base, color: COLORS.black },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: COLORS.white, fontSize: FONTS.md, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: FONTS.base, color: COLORS.gray500 },
  footerLink: { fontSize: FONTS.base, color: COLORS.primary, fontWeight: '600' },
});
