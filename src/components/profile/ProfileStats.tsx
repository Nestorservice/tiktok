import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';
import { formatNumber } from '../../utils/formatNumber';

interface Props { following: number; followers: number; likes: number; }

export default function ProfileStats({ following, followers, likes }: Props) {
  return (
    <View style={styles.row}>
      {[{ label: 'Abonnements', value: following }, { label: 'Abonnés', value: followers }, { label: "J'aime", value: likes }].map((s, i) => (
        <React.Fragment key={s.label}>
          {i > 0 && <View style={styles.divider} />}
          <View style={styles.stat}>
            <Text style={styles.count}>{formatNumber(s.value)}</Text>
            <Text style={styles.label}>{s.label}</Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: spacing.lg },
  stat: { alignItems: 'center', paddingHorizontal: spacing.xl },
  count: { color: colors.white, fontWeight: typography.bold, fontSize: typography.xl },
  label: { color: colors.gray, fontSize: typography.xs, marginTop: 2 },
  divider: { width: 1, height: 30, backgroundColor: colors.grayLight },
});
