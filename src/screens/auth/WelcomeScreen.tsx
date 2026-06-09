import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Nav = StackNavigationProp<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<Nav>();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>TikTok</Text>
        <Text style={styles.tagline}>Make Your Day</Text>
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('Register')} activeOpacity={0.8}>
          <Text style={styles.btnPrimaryText}>Utiliser téléphone ou email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondary} activeOpacity={0.8}>
          <Text style={styles.btnSecondaryText}>Continuer avec Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondary} activeOpacity={0.8}>
          <Text style={styles.btnSecondaryText}>Continuer avec Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginRow}>
          <Text style={styles.loginText}>Déjà un compte ? <Text style={styles.loginLink}>Se connecter</Text></Text>
        </TouchableOpacity>
        <Text style={styles.terms}>En continuant, tu acceptes nos Conditions d'utilisation et notre Politique de confidentialité.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: 32, fontWeight: typography.bold, color: colors.white, letterSpacing: -1 },
  tagline: { fontSize: typography.lg, color: colors.gray, marginTop: spacing.sm },
  bottom: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl, gap: spacing.md },
  btnPrimary: { backgroundColor: colors.white, height: 50, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  btnPrimaryText: { color: colors.background, fontWeight: typography.bold, fontSize: typography.base },
  btnSecondary: { height: 50, borderRadius: 4, borderWidth: 1, borderColor: colors.grayLight, justifyContent: 'center', alignItems: 'center' },
  btnSecondaryText: { color: colors.white, fontSize: typography.base },
  loginRow: { alignItems: 'center', marginTop: spacing.sm },
  loginText: { color: colors.white, fontSize: typography.md },
  loginLink: { textDecorationLine: 'underline' },
  terms: { color: colors.gray, fontSize: typography.xs, textAlign: 'center', lineHeight: 16 },
});
