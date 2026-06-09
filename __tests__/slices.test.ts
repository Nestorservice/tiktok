import authReducer, { setUser, clearUser } from '../src/store/slices/authSlice';
import feedReducer, { setVideos, appendVideos, setLoading } from '../src/store/slices/feedSlice';
import playerReducer, { setCurrentIndex } from '../src/store/slices/playerSlice';
import uiReducer, { setCommentSheetVideoId, clearCommentSheet } from '../src/store/slices/uiSlice';

const mockUser = {
  uid: '123',
  username: 'testuser',
  displayName: 'Test User',
  bio: '',
  avatar: '',
  followersCount: 0,
  followingCount: 0,
  videosCount: 0,
  isPrivate: false,
  isVerified: false,
  createdAt: null as any,
};

describe('authSlice', () => {
  it('returns initial state', () => {
    const state = authReducer(undefined, { type: '' });
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(true);
  });

  it('sets user', () => {
    const state = authReducer(undefined, setUser(mockUser));
    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
  });

  it('clears user', () => {
    const filled = authReducer(undefined, setUser(mockUser));
    const state = authReducer(filled, clearUser());
    expect(state.user).toBeNull();
  });
});

describe('feedSlice', () => {
  it('returns initial state', () => {
    const state = feedReducer(undefined, { type: '' });
    expect(state.videos).toEqual([]);
    expect(state.isLoading).toBe(false);
  });

  it('sets videos', () => {
    const state = feedReducer(undefined, setVideos([]));
    expect(state.videos).toEqual([]);
  });

  it('appends videos without duplicates', () => {
    const video = { videoId: 'v1' } as any;
    const s1 = feedReducer(undefined, setVideos([video]));
    const s2 = feedReducer(s1, appendVideos([video, { videoId: 'v2' } as any]));
    expect(s2.videos.length).toBe(2);
  });

  it('sets loading', () => {
    const state = feedReducer(undefined, setLoading(true));
    expect(state.isLoading).toBe(true);
  });
});

describe('playerSlice', () => {
  it('returns initial state', () => {
    const state = playerReducer(undefined, { type: '' });
    expect(state.currentIndex).toBe(0);
    expect(state.isPaused).toBe(false);
  });

  it('sets current index', () => {
    const state = playerReducer(undefined, setCurrentIndex(3));
    expect(state.currentIndex).toBe(3);
  });
});

describe('uiSlice', () => {
  it('returns initial state', () => {
    const state = uiReducer(undefined, { type: '' });
    expect(state.commentSheetVideoId).toBeNull();
  });

  it('sets comment sheet video id', () => {
    const state = uiReducer(undefined, setCommentSheetVideoId('vid123'));
    expect(state.commentSheetVideoId).toBe('vid123');
  });

  it('clears comment sheet', () => {
    const filled = uiReducer(undefined, setCommentSheetVideoId('vid123'));
    const state = uiReducer(filled, clearCommentSheet());
    expect(state.commentSheetVideoId).toBeNull();
  });
});
