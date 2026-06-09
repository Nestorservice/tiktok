import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

export const TAB_BAR_HEIGHT = 56;

export function PlusTabIcon() {
  return (
    <View style={styles.plusContainer}>
      <View style={styles.plusLeft} />
      <View style={styles.plusCenter}>
        <View style={styles.plusHorizontal} />
        <View style={styles.plusVertical} />
      </View>
      <View style={styles.plusRight} />
    </View>
  );
}

const styles = StyleSheet.create({
  plusContainer: { flexDirection: 'row', width: 44, height: 30, borderRadius: 8, overflow: 'hidden' },
  plusLeft: { flex: 1, backgroundColor: colors.secondary },
  plusCenter: { flex: 1.4, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' },
  plusRight: { flex: 1, backgroundColor: colors.primary },
  plusHorizontal: { position: 'absolute', width: 16, height: 2, backgroundColor: colors.background },
  plusVertical: { position: 'absolute', width: 2, height: 16, backgroundColor: colors.background },
});
