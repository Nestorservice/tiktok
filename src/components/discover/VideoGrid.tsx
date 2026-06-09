import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Video } from '../../types';
import { formatNumber } from '../../utils/formatNumber';
import { colors, typography } from '../../theme';

const CELL = (Dimensions.get('window').width - 2) / 2;

interface Props { videos: Video[]; onPress: (video: Video) => void; }

export default function VideoGrid({ videos, onPress }: Props) {
  return (
    <View style={styles.grid}>
      {videos.map(v => (
        <TouchableOpacity key={v.videoId} style={styles.cell} onPress={() => onPress(v)} activeOpacity={0.8}>
          <FastImage source={v.thumbnailUrl ? { uri: v.thumbnailUrl } : undefined} style={styles.thumb} />
          <View style={styles.overlay}><Text style={styles.views}>{formatNumber(v.viewsCount)}</Text></View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  cell: { width: CELL, height: CELL * (16 / 9), backgroundColor: colors.surfaceLight },
  thumb: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', bottom: 6, left: 6 },
  views: { color: colors.white, fontSize: typography.xs, fontWeight: typography.bold },
});
