import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, typography, spacing } from '../../theme';
import { Comment, User } from '../../types';
import { formatNumber } from '../../utils/formatNumber';

interface Props { comment: Comment; author: User | null; onProfilePress: () => void; }

export default function CommentItem({ comment, author, onProfilePress }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onProfilePress} activeOpacity={0.8}>
        <FastImage source={author?.avatar ? { uri: author.avatar } : undefined} style={styles.avatar} />
      </TouchableOpacity>
      <View style={styles.content}>
        <TouchableOpacity onPress={onProfilePress} activeOpacity={0.8}>
          <Text style={styles.username}>{author?.username ?? 'utilisateur'}</Text>
        </TouchableOpacity>
        <Text style={styles.text}>{comment.text}</Text>
        <Text style={styles.time}>il y a quelques instants · Répondre</Text>
      </View>
      <TouchableOpacity style={styles.likeBtn}>
        <Ionicons name="heart-outline" size={18} color={colors.gray} />
        <Text style={styles.likeCount}>{formatNumber(comment.likesCount)}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, alignItems: 'flex-start' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceLight },
  content: { flex: 1, marginLeft: spacing.md },
  username: { color: colors.white, fontWeight: typography.bold, fontSize: 13 },
  text: { color: colors.white, fontSize: 13, marginTop: 2, lineHeight: 18 },
  time: { color: colors.gray, fontSize: typography.xs, marginTop: spacing.xs },
  likeBtn: { alignItems: 'center', marginLeft: spacing.sm },
  likeCount: { color: colors.gray, fontSize: typography.xs, marginTop: 2 },
});
