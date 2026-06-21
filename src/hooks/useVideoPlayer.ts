import { useRef, useCallback, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrentIndex, setPaused } from '../store/slices/playerSlice';
import { appendVideos, setLoading, setHasMore, setError } from '../store/slices/feedSlice';
import { fetchFeedVideos } from '../services/firebase/videos.service';
import { getUserById } from '../services/firebase/users.service';
import { checkIsLiked } from '../services/firebase/likes.service';
import { FEED_PREFETCH_THRESHOLD, FEED_PAGE_SIZE } from '../utils/constants';
import { VideoWithAuthor } from '../types';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export function useVideoPlayer() {
  const dispatch = useAppDispatch();
  const { currentIndex, isPaused } = useAppSelector(s => s.player);
  const { videos, hasMore } = useAppSelector(s => s.feed);
  const currentUid = useAppSelector(s => s.auth.user?.uid);
  const lastDocRef = useRef<FirebaseFirestoreTypes.DocumentSnapshot | null>(null);
  const isFetching = useRef(false);

  const loadVideos = useCallback(async (isInitial = false) => {
    if (isFetching.current || (!isInitial && !hasMore)) return;
    isFetching.current = true;
    dispatch(setLoading(true));
    try {
      const { videos: newVideos, lastDoc } = await fetchFeedVideos(isInitial ? undefined : lastDocRef.current ?? undefined);
      if (newVideos.length < FEED_PAGE_SIZE) dispatch(setHasMore(false));
      lastDocRef.current = lastDoc;
      const enriched: VideoWithAuthor[] = await Promise.all(
        newVideos.map(async v => {
          const author = await getUserById(v.authorId);
          const isLiked = currentUid ? await checkIsLiked(v.videoId, currentUid) : false;
          return { ...v, author: author!, isLiked, isFollowing: false };
        }),
      );
      dispatch(appendVideos(enriched));
    } catch { dispatch(setError('Impossible de charger les vidéos')); }
    finally { isFetching.current = false; }
  }, [dispatch, hasMore, currentUid]);

  useEffect(() => { loadVideos(true); }, [loadVideos]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      const idx = viewableItems[0].index;
      dispatch(setCurrentIndex(idx));
      if (idx >= videos.length - FEED_PREFETCH_THRESHOLD) loadVideos();
    }
  }, [dispatch, videos.length, loadVideos]);

  useFocusEffect(useCallback(() => {
    dispatch(setPaused(false));
    return () => dispatch(setPaused(true));
  }, [dispatch]));

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => dispatch(setPaused(state !== 'active')));
    return () => sub.remove();
  }, [dispatch]);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 });
  return { currentIndex, isPaused, onViewableItemsChanged, viewabilityConfig: viewabilityConfig.current, loadMore: () => loadVideos() };
}
