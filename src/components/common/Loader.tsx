import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../theme';

export default function Loader() {
  return <View style={styles.container}><ActivityIndicator color={colors.primary} size="large" /></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' } });
