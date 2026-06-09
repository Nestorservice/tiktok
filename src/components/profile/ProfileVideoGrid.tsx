import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Video } from '../../types';
import { formatNumber } from '../../utils/formatNumber';
import { colors, typography } from '../../theme';

const CELL = Dimensions.get('window').width / 3;
interface Props { videos: Video[]; onPress: (video: Video) => void; }

export default function ProfileVideoGrid({ videos, onPress }: Props) {
  return (
    <View style={styles.grid}>
      {videos.map(v => (
        <TouchableOpacity key={v.videoId} style={styles.cell} onPress={() => onPress(v)} activeOpacity={0.8}>
          <FastImage source={v.thumbnailUrl ? { uri: v.thumbnailUrl } : undefined} style={styles.thumb} />
          <View style={styles.overlay}><Ionicons name="play" size={12} color={colors.white} /><Text style={styles.count}>{formatNumber(v.viewsCount)}</Text></View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: CELL, height: CELL * (4 / 3), backgroundColor: colors.surfaceLight },
  thumb: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', bottom: 4, left: 4, flexDirection: 'row', alignItems: 'center', gap: 2 },
  count: { color: colors.white, fontSize: typography.xs, fontWeight: typography.bold },
});
