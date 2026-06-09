import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';

const TRENDING = ['fyp', 'viral', 'dance', 'funny', 'music', 'food', 'travel', 'art', 'sport', 'gaming'];

interface Props { onSelect: (tag: string) => void; }

export default function TrendingHashtags({ onSelect }: Props) {
  return (
    <FlatList data={TRENDING} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list} keyExtractor={item => item}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.pill} onPress={() => onSelect(item)} activeOpacity={0.7}>
          <Text style={styles.text}>#{item}</Text>
        </TouchableOpacity>
      )} />
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.md },
  pill: { backgroundColor: colors.surfaceLight, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20, height: 36, justifyContent: 'center' },
  text: { color: colors.white, fontSize: typography.sm },
});
