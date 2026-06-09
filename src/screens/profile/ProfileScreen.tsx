import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors, spacing } from '../../theme';
import { useAppSelector } from '../../store/hooks';
import { useFollow } from '../../hooks/useFollow';
import { getUserById, isFollowing as checkFollowStatus } from '../../services/firebase/users.service';
import { getVideosByUser } from '../../services/firebase/videos.service';
import { User, Video } from '../../types';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileStats from '../../components/profile/ProfileStats';
import ProfileVideoGrid from '../../components/profile/ProfileVideoGrid';
import { MainTabParamList } from '../../navigation/MainNavigator';

import { EMPTY_STATES } from '../../utils/constants';

type ProfileRouteProp = RouteProp<MainTabParamList, 'Profile'> & { params?: { userId?: string } };

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<ProfileRouteProp>();
  const targetUserId = route.params?.userId;
  const currentUser = useAppSelector(s => s.auth.user);
  
  const [user, setUser] = useState<User | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { follow } = useFollow();

  const isOwnProfile = !targetUserId || targetUserId === currentUser?.uid;

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const uid = targetUserId || currentUser?.uid;
      if (!uid) return;

      const [userData, videoData] = await Promise.all([
        isOwnProfile ? Promise.resolve(currentUser) : getUserById(uid),
        getVideosByUser(uid),
      ]);

      if (!userData) throw new Error("Utilisateur introuvable");
      setUser(userData);
      setVideos(videoData);

      if (!isOwnProfile && currentUser) {
        setIsFollowing(await checkFollowStatus(currentUser.uid, uid));
      }
    } catch (e: any) {
      setError(e.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }, [targetUserId, currentUser, isOwnProfile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleFollow = useCallback(async () => {
    if (!user || !currentUser) return;
    await follow(user.uid, isFollowing);
    setIsFollowing(!isFollowing);
  }, [user, currentUser, isFollowing, follow]);

  if (isLoading && !user) {
    return <View style={styles.loader}><ActivityIndicator color={colors.primary} size="large" /></View>;
  }

  if (error && !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}><Text style={styles.errorText}>{error}</Text></View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}><Text style={styles.emptyText}>{EMPTY_STATES.profile}</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader 
          user={user} 
          isOwnProfile={isOwnProfile} 
          isFollowing={isFollowing} 
          onFollow={handleFollow} 
          onEdit={() => navigation.navigate('EditProfile')}
          onBack={!isOwnProfile ? () => navigation.goBack() : undefined}
        />
        <ProfileStats following={user.followingCount} followers={user.followersCount} likes={0} />
        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : videos.length === 0 ? (
          <View style={styles.empty}><Text style={styles.emptyText}>{EMPTY_STATES.profile}</Text></View>
        ) : (
          <ProfileVideoGrid videos={videos} onPress={() => {}} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loader: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  empty: { padding: spacing.xxxl, alignItems: 'center', flex: 1, justifyContent: 'center' },
  emptyText: { color: colors.gray },
  errorText: { color: colors.primary, textAlign: 'center' },
});
