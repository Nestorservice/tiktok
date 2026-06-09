import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import { colors, typography, spacing } from '../../theme';
import { VideoWithAuthor } from '../../types';
import { formatNumber } from '../../utils/formatNumber';
import FollowButton from './FollowButton';
import MusicDisc from './MusicDisc';

interface Props { video: VideoWithAuthor; isPlaying: boolean; onLike: () => void; onComment: () => void; onFollow: () => void; onShare: () => void; onProfilePress: () => void; }

export default function VideoActions({ video, isPlaying, onLike, onComment, onFollow, onShare, onProfilePress }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.avatarWrap} onPress={onProfilePress} activeOpacity={0.9}>
        <FastImage source={video.author?.avatar ? { uri: video.author.avatar } : undefined} style={styles.avatar} />
        <FollowButton isFollowing={video.isFollowing} onPress={onFollow} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.action} onPress={onLike} activeOpacity={0.7}>
        <Ionicons name={video.isLiked ? 'heart' : 'heart-outline'} size={36} color={video.isLiked ? colors.primary : colors.white} />
        <Text style={styles.count}>{formatNumber(video.likesCount)}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.action} onPress={onComment} activeOpacity={0.7}>
        <Ionicons name="chatbubble-ellipses-outline" size={34} color={colors.white} />
        <Text style={styles.count}>{formatNumber(video.commentsCount)}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.action} activeOpacity={0.7}>
        <Ionicons name="bookmark-outline" size={34} color={colors.white} />
        <Text style={styles.count}>{formatNumber(video.sharesCount)}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.action} onPress={onShare} activeOpacity={0.7}>
        <Ionicons name="arrow-redo-outline" size={34} color={colors.white} />
        <Text style={styles.shareLabel}>Partager</Text>
      </TouchableOpacity>
      <MusicDisc thumbnailUrl={video.thumbnailUrl} isPlaying={isPlaying} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', right: 12, bottom: 80, alignItems: 'center', gap: 20 },
  avatarWrap: { position: 'relative', marginBottom: spacing.sm },
  avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 1.5, borderColor: colors.white, backgroundColor: colors.surfaceLight },
  action: { alignItems: 'center' },
  count: { color: colors.white, fontSize: typography.sm, fontWeight: typography.bold, marginTop: 2 },
  shareLabel: { color: colors.white, fontSize: 11, marginTop: 2 },
});
