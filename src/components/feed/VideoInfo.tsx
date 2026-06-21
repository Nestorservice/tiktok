import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, typography, spacing } from '../../theme';
import { VideoWithAuthor } from '../../types';

interface Props { video: VideoWithAuthor; onProfilePress: () => void; }

export default function VideoInfo({ video, onProfilePress }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onProfilePress} activeOpacity={0.8}>
        <Text style={styles.username}>@{video.author?.username ?? ''}</Text>
      </TouchableOpacity>
      <Text style={styles.description} numberOfLines={2}>
        {video.description}{' '}
        {(video.hashtags ?? []).map(tag => <Text key={tag} style={styles.hashtag}>#{tag} </Text>)}
      </Text>
      <View style={styles.musicRow}>
        <Ionicons name="musical-notes" size={14} color={colors.white} />
        <Text style={styles.musicText} numberOfLines={1}> {video.musicName || `Son original — @${video.author?.username ?? ''}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 100, left: spacing.lg, right: 80 },
  username: { color: colors.white, fontWeight: typography.bold, fontSize: typography.base, marginBottom: spacing.xs },
  description: { color: colors.white, fontSize: typography.sm, lineHeight: 18, marginBottom: spacing.sm },
  hashtag: { color: colors.white, fontWeight: typography.bold },
  musicRow: { flexDirection: 'row', alignItems: 'center' },
  musicText: { color: colors.white, fontSize: typography.sm, flex: 1 },
});
