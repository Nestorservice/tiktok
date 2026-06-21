import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, Dimensions, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { useVideoPlayer } from '../../hooks/useVideoPlayer';
import VideoItem from '../../components/feed/VideoItem';
import { VideoWithAuthor } from '../../types';
import { colors, typography, spacing } from '../../theme';
import CommentSheet from '../../components/comments/CommentSheet';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const { videos, isLoading, error } = useAppSelector(s => s.feed);
  const { currentIndex, isPaused, onViewableItemsChanged, viewabilityConfig } = useVideoPlayer();
  const commentVideoId = useAppSelector(s => s.ui.commentSheetVideoId);

  const getItemLayout = useCallback((_: any, index: number) => ({ length: height, offset: height * index, index }), []);
  const renderItem = useCallback(({ item, index }: { item: VideoWithAuthor; index: number }) =>
    <VideoItem video={item} isActive={index === currentIndex} isPausedGlobal={isPaused} />, [currentIndex, isPaused]);
  const keyExtractor = useCallback((item: VideoWithAuthor) => item.videoId, []);

  if (isLoading && videos.length === 0) return <View style={styles.loader}><ActivityIndicator color={colors.primary} size="large" /></View>;
  
  if (error && videos.length === 0) return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <FlatList data={videos} renderItem={renderItem} keyExtractor={keyExtractor} pagingEnabled showsVerticalScrollIndicator={false} decelerationRate="fast" removeClippedSubviews maxToRenderPerBatch={3} windowSize={5} getItemLayout={getItemLayout} onViewableItemsChanged={onViewableItemsChanged} viewabilityConfig={viewabilityConfig} ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>Aucune vidéo pour le moment</Text></View>} />
      <View style={styles.topBar} pointerEvents="none">
        <Text style={styles.tab}>Abonnements</Text>
        <Text style={[styles.tab, styles.tabActive]}>Pour toi</Text>
      </View>
      {commentVideoId && <CommentSheet videoId={commentVideoId} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loader: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 80, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 12, gap: 20, zIndex: 10 },
  tab: { color: 'rgba(255,255,255,0.6)', fontSize: typography.lg, fontWeight: typography.bold },
  tabActive: { color: colors.white, borderBottomWidth: 2, borderBottomColor: colors.white, paddingBottom: 2 },
  empty: { height, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: colors.gray },
  errorContainer: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  errorText: { color: colors.primary, textAlign: 'center', fontSize: typography.base },
});
