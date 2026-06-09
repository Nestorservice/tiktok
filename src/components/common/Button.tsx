import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { colors, typography } from '../../theme';

interface Props extends TouchableOpacityProps { title: string; variant?: 'primary' | 'outline'; loading?: boolean; }

export default function Button({ title, variant = 'primary', loading, style, ...rest }: Props) {
  return (
    <TouchableOpacity style={[styles.base, variant === 'outline' ? styles.outline : styles.primary, style]} activeOpacity={0.8} {...rest}>
      {loading ? <ActivityIndicator color={colors.white} size="small" /> : <Text style={[styles.text, variant === 'outline' && styles.outlineText]}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { height: 50, borderRadius: 4, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  primary: { backgroundColor: colors.primary },
  outline: { borderWidth: 1, borderColor: colors.grayLight },
  text: { color: colors.white, fontWeight: typography.bold, fontSize: typography.base },
  outlineText: { color: colors.white },
});
