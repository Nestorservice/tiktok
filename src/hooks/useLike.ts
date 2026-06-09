import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateVideoLike } from '../store/slices/feedSlice';
import { toggleLike } from '../services/firebase/likes.service';

export function useLike() {
  const dispatch = useAppDispatch();
  const uid = useAppSelector(s => s.auth.user?.uid);
  const like = useCallback(async (videoId: string, currentlyLiked: boolean) => {
    if (!uid) return;
    dispatch(updateVideoLike({ videoId, isLiked: !currentlyLiked, delta: currentlyLiked ? -1 : 1 }));
    try { await toggleLike(videoId, uid, currentlyLiked); }
    catch { dispatch(updateVideoLike({ videoId, isLiked: currentlyLiked, delta: currentlyLiked ? 1 : -1 })); }
  }, [dispatch, uid]);
  return { like };
}
