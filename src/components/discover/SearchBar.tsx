import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography } from '../../theme';

interface Props { value: string; onChangeText: (t: string) => void; onSubmit: () => void; }

export default function SearchBar({ value, onChangeText, onSubmit }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={colors.gray} style={styles.icon} />
      <TextInput style={styles.input} placeholder="Rechercher" placeholderTextColor={colors.gray} value={value} onChangeText={onChangeText} onSubmitEditing={onSubmit} returnKeyType="search" autoCorrect={false} autoCapitalize="none" />
      {value.length > 0 && <TouchableOpacity onPress={() => onChangeText('')}><Ionicons name="close-circle" size={18} color={colors.gray} /></TouchableOpacity>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceLight, borderRadius: 22, height: 45, paddingHorizontal: spacing.md, marginHorizontal: spacing.lg, marginBottom: spacing.md },
  icon: { marginRight: spacing.sm },
  input: { flex: 1, color: colors.white, fontSize: typography.base },
});
