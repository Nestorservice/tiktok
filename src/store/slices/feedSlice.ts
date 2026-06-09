import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VideoWithAuthor } from '../../types';

interface FeedState {
  videos: VideoWithAuthor[];
  isLoading: boolean;
  hasMore: boolean;
  lastDocId: string | null;
  error: string | null;
}

const initialState: FeedState = {
  videos: [],
  isLoading: false,
  hasMore: true,
  lastDocId: null,
  error: null,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setVideos(state, action: PayloadAction<VideoWithAuthor[]>) {
      state.videos = action.payload;
      state.isLoading = false;
    },
    appendVideos(state, action: PayloadAction<VideoWithAuthor[]>) {
      const existingIds = new Set(state.videos.map(v => v.videoId));
      const newVideos = action.payload.filter(v => !existingIds.has(v.videoId));
      state.videos.push(...newVideos);
      state.isLoading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setHasMore(state, action: PayloadAction<boolean>) {
      state.hasMore = action.payload;
    },
    setLastDocId(state, action: PayloadAction<string | null>) {
      state.lastDocId = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateVideoLike(
      state,
      action: PayloadAction<{ videoId: string; isLiked: boolean; delta: number }>,
    ) {
      const video = state.videos.find(v => v.videoId === action.payload.videoId);
      if (video) {
        video.isLiked = action.payload.isLiked;
        video.likesCount = Math.max(0, video.likesCount + action.payload.delta);
      }
    },
  },
});

export const {
  setVideos,
  appendVideos,
  setLoading,
  setHasMore,
  setLastDocId,
  setError,
  updateVideoLike,
} = feedSlice.actions;
export default feedSlice.reducer;
