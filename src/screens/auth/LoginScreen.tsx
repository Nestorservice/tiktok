import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../hooks/useAuth';

type Nav = StackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.inner} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Connexion</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.gray} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
        <TextInput style={styles.input} placeholder="Mot de passe" placeholderTextColor={colors.gray} value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={[styles.btn, (!email || !password) && styles.btnDisabled]} onPress={() => login(email.trim(), password)} disabled={isLoading || !email || !password} activeOpacity={0.8}>
          {isLoading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.btnText}>Se connecter</Text>}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  back: { marginBottom: spacing.xl },
  backText: { color: colors.white, fontSize: typography.xl },
  title: { fontSize: 22, fontWeight: typography.bold, color: colors.white, marginBottom: spacing.xl },
  error: { color: colors.primary, fontSize: typography.sm, marginBottom: spacing.md },
  input: { backgroundColor: colors.surfaceLight, color: colors.white, height: 50, borderRadius: 8, paddingHorizontal: spacing.lg, fontSize: typography.base, marginBottom: spacing.md },
  btn: { backgroundColor: colors.primary, height: 50, borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginTop: spacing.md },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: colors.white, fontWeight: typography.bold, fontSize: typography.base },
});
