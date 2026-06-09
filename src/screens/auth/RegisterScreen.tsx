import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail, isValidPassword, isValidUsername } from '../../utils/validators';

type Nav = StackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { register, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const isFormValid = isValidEmail(email) && isValidUsername(username) && isValidPassword(password) && displayName.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.inner} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Créer un compte</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <TextInput style={styles.input} placeholder="Nom d'affichage" placeholderTextColor={colors.gray} value={displayName} onChangeText={setDisplayName} />
        <TextInput style={styles.input} placeholder="Nom d'utilisateur (@handle)" placeholderTextColor={colors.gray} value={username} onChangeText={setUsername} autoCapitalize="none" autoCorrect={false} />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.gray} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Mot de passe (min. 6 caractères)" placeholderTextColor={colors.gray} value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={[styles.btn, !isFormValid && styles.btnDisabled]} onPress={() => register(email.trim(), password, username.trim().toLowerCase(), displayName.trim())} disabled={isLoading || !isFormValid} activeOpacity={0.8}>
          {isLoading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.btnText}>Créer le compte</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginRow}>
          <Text style={styles.loginText}>Déjà un compte ? <Text style={styles.loginLink}>Se connecter</Text></Text>
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
  btn: { backgroundColor: colors.primary, height: 50, borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginTop: spacing.sm },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: colors.white, fontWeight: typography.bold, fontSize: typography.base },
  loginRow: { alignItems: 'center', marginTop: spacing.xl },
  loginText: { color: colors.white, fontSize: typography.md },
  loginLink: { textDecorationLine: 'underline' },
});
