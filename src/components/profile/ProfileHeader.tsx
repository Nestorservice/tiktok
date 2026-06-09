import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, typography, spacing } from '../../theme';
import { User } from '../../types';

interface Props { user: User; isOwnProfile: boolean; isFollowing: boolean; onFollow: () => void; onEdit: () => void; onBack?: () => void; }

export default function ProfileHeader({ user, isOwnProfile, isFollowing, onFollow, onEdit, onBack }: Props) {
  return (
    <View style={styles.container}>
      {onBack && <TouchableOpacity style={styles.back} onPress={onBack}><Ionicons name="arrow-back" size={24} color={colors.white} /></TouchableOpacity>}
      <Text style={styles.username}>@{user.username}</Text>
      <FastImage source={user.avatar ? { uri: user.avatar } : undefined} style={styles.avatar} />
      {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}
      <View style={styles.actions}>
        {isOwnProfile ? (
          <TouchableOpacity style={styles.outlineBtn} onPress={onEdit}><Text style={styles.outlineBtnText}>Modifier le profil</Text></TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={[styles.followBtn, isFollowing && styles.outlineBtn]} onPress={onFollow} activeOpacity={0.8}>
              <Text style={[styles.followBtnText, isFollowing && styles.outlineBtnText]}>{isFollowing ? 'Abonné' : "S'abonner"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.outlineBtn}><Text style={styles.outlineBtnText}>Message</Text></TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: spacing.xl, paddingBottom: spacing.md },
  back: { position: 'absolute', left: spacing.lg, top: spacing.xl },
  username: { color: colors.white, fontWeight: typography.bold, fontSize: typography.lg, marginBottom: spacing.lg },
  avatar: { width: 88, height: 88, borderRadius: 44, borderWidth: 2, borderColor: colors.white, backgroundColor: colors.surfaceLight },
  bio: { color: colors.white, fontSize: 13, textAlign: 'center', marginTop: spacing.sm, paddingHorizontal: spacing.xl },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  followBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, height: 36, borderRadius: 4, justifyContent: 'center', alignItems: 'center', minWidth: 120 },
  followBtnText: { color: colors.white, fontWeight: typography.bold, fontSize: typography.sm },
  outlineBtn: { borderWidth: 1, borderColor: colors.grayLight, paddingHorizontal: spacing.lg, height: 36, borderRadius: 4, justifyContent: 'center', alignItems: 'center', minWidth: 120 },
  outlineBtnText: { color: colors.white, fontSize: typography.sm },
});
