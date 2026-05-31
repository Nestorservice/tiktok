# TikTok Clone — Plan Phase 1 : Fondations

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Installer toutes les dépendances et mettre en place l'infrastructure complète : thème, utils, Firebase config, Redux store, services Firebase, navigation avec stubs, et App.tsx connecté.

**Architecture:** 3 couches indépendantes (thème/utils, store/services, navigation) qui se construisent en parallèle puis se connectent dans App.tsx. Chaque couche n'a aucune dépendance sur les autres jusqu'à la tâche finale.

**Tech Stack:** React Native 0.85.3, TypeScript, @react-native-firebase v21, Redux Toolkit v2, React Navigation v6

---

## Task 1 : Installer toutes les dépendances

**Files:**
- Modify: `package.json`
- Modify: `android/app/build.gradle`
- Modify: `android/build.gradle`
- Modify: `android/gradle.properties`

- [ ] **Step 1 : Installer les dépendances npm**

```bash
npm install \
  @react-native-firebase/app@^21.0.0 \
  @react-native-firebase/auth@^21.0.0 \
  @react-native-firebase/firestore@^21.0.0 \
  @react-native-firebase/storage@^21.0.0 \
  @react-native-firebase/messaging@^21.0.0 \
  @react-navigation/native@^6.1.18 \
  @react-navigation/stack@^6.4.1 \
  @react-navigation/bottom-tabs@^6.6.1 \
  @react-navigation/material-top-tabs@^6.6.5 \
  react-native-tab-view@^3.5.2 \
  @reduxjs/toolkit@^2.3.0 \
  react-redux@^9.1.2 \
  react-native-video@^6.7.2 \
  react-native-vision-camera@^4.6.4 \
  react-native-reanimated@^3.16.2 \
  react-native-gesture-handler@^2.21.2 \
  @gorhom/bottom-sheet@^5.1.1 \
  lottie-react-native@^7.2.2 \
  react-native-fast-image@^9.1.3 \
  react-native-vector-icons@^10.2.0 \
  react-native-linear-gradient@^2.8.3 \
  react-native-permissions@^4.1.5 \
  react-native-share@^10.2.1 \
  @react-native-async-storage/async-storage@^2.1.0 \
  react-native-screens@^4.4.0 \
  react-native-compressor@^1.9.3 \
  reselect@^5.1.1
```

- [ ] **Step 2 : Installer les devDependencies de test**

```bash
npm install --save-dev \
  @testing-library/react-native@^12.4.3 \
  @types/react-native-vector-icons@^6.4.18
```

- [ ] **Step 3 : Configurer google-services dans android/app/build.gradle**

Ouvrir `android/app/build.gradle` et ajouter en haut du fichier :

```groovy
apply plugin: "com.google.gms.google-services"
```

Le fichier doit commencer ainsi :
```groovy
apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "com.facebook.react"
apply plugin: "com.google.gms.google-services"
```

- [ ] **Step 4 : Ajouter google-services classpath dans android/build.gradle**

Modifier `android/build.gradle` :

```groovy
buildscript {
    ext {
        buildToolsVersion = "35.0.0"
        minSdkVersion = 24
        compileSdkVersion = 35
        targetSdkVersion = 35
        ndkVersion = "27.1.12297006"
        kotlinVersion = "2.0.21"
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin")
        classpath("com.google.gms:google-services:4.4.2")
    }
}
```

- [ ] **Step 5 : Configurer android/gradle.properties**

Ajouter à la fin de `android/gradle.properties` :

```properties
android.enableJetifier=true
```

- [ ] **Step 6 : Configurer Reanimated dans babel.config.js**

Remplacer le contenu de `babel.config.js` :

```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
  ],
};
```

- [ ] **Step 7 : Placer google-services.json**

Copier ton fichier `google-services.json` depuis la console Firebase dans :
```
android/app/google-services.json
```

- [ ] **Step 8 : Vérifier que le build Android démarre**

```bash
npm run android
```

Attendu : app lance sur émulateur/device sans crash.

- [ ] **Step 9 : Commit**

```bash
git add android/app/build.gradle android/build.gradle android/gradle.properties babel.config.js package.json package-lock.json
git commit -m "feat: install all dependencies and configure Firebase + Reanimated"
```

---

## Task 2 : Système de thème

**Files:**
- Create: `src/theme/colors.ts`
- Create: `src/theme/typography.ts`
- Create: `src/theme/spacing.ts`
- Create: `src/theme/index.ts`

- [ ] **Step 1 : Créer src/theme/colors.ts**

```ts
export const colors = {
  background: '#000000',
  surface: '#1C1C1E',
  surfaceLight: '#2C2C2E',
  primary: '#FE2C55',
  secondary: '#25F4EE',
  white: '#FFFFFF',
  gray: '#8E8E93',
  grayLight: '#48484A',
  overlay: 'rgba(0,0,0,0.5)',
  gradientBottom: ['transparent', 'rgba(0,0,0,0.8)'] as string[],
  verified: '#20D5EC',
} as const;

export type Colors = typeof colors;
```

- [ ] **Step 2 : Créer src/theme/typography.ts**

```ts
export const typography = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  bold: '700' as const,
  semibold: '600' as const,
  medium: '500' as const,
  regular: '400' as const,
} as const;

export type Typography = typeof typography;
```

- [ ] **Step 3 : Créer src/theme/spacing.ts**

```ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export type Spacing = typeof spacing;
```

- [ ] **Step 4 : Créer src/theme/index.ts**

```ts
export { colors } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';
export type { Colors } from './colors';
export type { Typography } from './typography';
export type { Spacing } from './spacing';
```

- [ ] **Step 5 : Écrire les tests**

Créer `__tests__/theme.test.ts` :

```ts
import { colors, typography, spacing } from '../src/theme';

describe('theme', () => {
  it('colors has primary TikTok red', () => {
    expect(colors.primary).toBe('#FE2C55');
  });

  it('colors has secondary TikTok cyan', () => {
    expect(colors.secondary).toBe('#25F4EE');
  });

  it('colors background is black', () => {
    expect(colors.background).toBe('#000000');
  });

  it('typography has all font weights', () => {
    expect(typography.bold).toBe('700');
    expect(typography.semibold).toBe('600');
    expect(typography.medium).toBe('500');
    expect(typography.regular).toBe('400');
  });

  it('spacing values are positive numbers', () => {
    Object.values(spacing).forEach(v => expect(v).toBeGreaterThan(0));
  });
});
```

- [ ] **Step 6 : Lancer les tests**

```bash
npm test -- --testPathPattern="theme" --watchAll=false
```

Attendu : 5 tests passent.

- [ ] **Step 7 : Commit**

```bash
git add src/theme/ __tests__/theme.test.ts
git commit -m "feat: add theme system (colors, typography, spacing)"
```

---

## Task 3 : Utilitaires

**Files:**
- Create: `src/utils/formatNumber.ts`
- Create: `src/utils/formatTime.ts`
- Create: `src/utils/validators.ts`
- Create: `src/utils/constants.ts`

- [ ] **Step 1 : Écrire les tests en premier**

Créer `__tests__/utils.test.ts` :

```ts
import { formatNumber } from '../src/utils/formatNumber';
import { formatTime } from '../src/utils/formatTime';
import { isValidEmail, isValidUsername } from '../src/utils/validators';

describe('formatNumber', () => {
  it('returns number as string under 1000', () => {
    expect(formatNumber(999)).toBe('999');
  });
  it('formats thousands as K', () => {
    expect(formatNumber(1200)).toBe('1.2K');
  });
  it('formats millions as M', () => {
    expect(formatNumber(2500000)).toBe('2.5M');
  });
  it('handles 0', () => {
    expect(formatNumber(0)).toBe('0');
  });
  it('formats exactly 1000 as 1K', () => {
    expect(formatNumber(1000)).toBe('1K');
  });
});

describe('formatTime', () => {
  it('formats seconds under a minute', () => {
    expect(formatTime(45)).toBe('0:45');
  });
  it('formats minutes and seconds', () => {
    expect(formatTime(90)).toBe('1:30');
  });
  it('pads seconds under 10', () => {
    expect(formatTime(65)).toBe('1:05');
  });
});

describe('validators', () => {
  it('validates correct email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });
  it('rejects invalid email', () => {
    expect(isValidEmail('notanemail')).toBe(false);
  });
  it('validates correct username', () => {
    expect(isValidUsername('user_123')).toBe(true);
  });
  it('rejects username with spaces', () => {
    expect(isValidUsername('user name')).toBe(false);
  });
  it('rejects username shorter than 3 chars', () => {
    expect(isValidUsername('ab')).toBe(false);
  });
  it('rejects username longer than 30 chars', () => {
    expect(isValidUsername('a'.repeat(31))).toBe(false);
  });
});
```

- [ ] **Step 2 : Lancer les tests pour confirmer qu'ils échouent**

```bash
npm test -- --testPathPattern="utils" --watchAll=false
```

Attendu : FAIL — modules not found.

- [ ] **Step 3 : Créer src/utils/formatNumber.ts**

```ts
export function formatNumber(n: number): string {
  if (n >= 1_000_000) {
    const val = n / 1_000_000;
    return `${parseFloat(val.toFixed(1))}M`;
  }
  if (n >= 1_000) {
    const val = n / 1_000;
    return `${parseFloat(val.toFixed(1))}K`;
  }
  return String(n);
}
```

- [ ] **Step 4 : Créer src/utils/formatTime.ts**

```ts
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

- [ ] **Step 5 : Créer src/utils/validators.ts**

```ts
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,30}$/.test(username);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}
```

- [ ] **Step 6 : Créer src/utils/constants.ts**

```ts
export const AUTH_ERRORS: Record<string, string> = {
  'auth/wrong-password': 'Mot de passe incorrect',
  'auth/email-already-in-use': 'Email déjà utilisé',
  'auth/user-not-found': 'Aucun compte avec cet email',
  'auth/invalid-email': 'Email invalide',
  'auth/weak-password': 'Mot de passe trop court (min. 6 caractères)',
  'auth/network-request-failed': 'Pas de connexion internet',
  'auth/too-many-requests': 'Trop de tentatives, réessaie plus tard',
};

export const FEED_PAGE_SIZE = 10;
export const FEED_PREFETCH_THRESHOLD = 7;
export const DOUBLE_TAP_DELAY = 300;
export const MUSIC_DISC_DURATION = 8000;
export const MARQUEE_DURATION = 4000;

export const STORAGE_PATHS = {
  videos: (uid: string, timestamp: number) => `videos/${uid}/${timestamp}.mp4`,
  avatars: (uid: string) => `avatars/${uid}.jpg`,
};

export const COLLECTIONS = {
  users: 'users',
  videos: 'videos',
  notifications: 'notifications',
} as const;

export const SUBCOLLECTIONS = {
  following: 'following',
  likes: 'likes',
  comments: 'comments',
  notifItems: 'items',
} as const;

export const EMPTY_STATES = {
  feed: 'Aucune vidéo pour le moment',
  discover: 'Aucun résultat',
  profile: 'Aucune vidéo publiée',
  inbox: 'Aucune notification',
  comments: 'Soyez le premier à commenter',
} as const;
```

- [ ] **Step 7 : Lancer les tests**

```bash
npm test -- --testPathPattern="utils" --watchAll=false
```

Attendu : 12 tests passent.

- [ ] **Step 8 : Commit**

```bash
git add src/utils/ __tests__/utils.test.ts
git commit -m "feat: add utils (formatNumber, formatTime, validators, constants)"
```

---

## Task 4 : Types TypeScript partagés

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1 : Créer src/types/index.ts**

```ts
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface User {
  uid: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  followersCount: number;
  followingCount: number;
  videosCount: number;
  isPrivate: boolean;
  isVerified: boolean;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

export interface Video {
  videoId: string;
  authorId: string;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  hashtags: string[];
  musicName: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  duration: number;
  isPublic: boolean;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

export interface Comment {
  commentId: string;
  authorId: string;
  text: string;
  likesCount: number;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention';

export interface Notification {
  type: NotificationType;
  fromUid: string;
  videoId: string | null;
  text: string;
  isRead: boolean;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

export interface VideoWithAuthor extends Video {
  author: User;
  isLiked: boolean;
  isFollowing: boolean;
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/types/
git commit -m "feat: add shared TypeScript types"
```

---

## Task 5 : Configuration Firebase

**Files:**
- Create: `src/config/firebase.ts`

- [ ] **Step 1 : Créer src/config/firebase.ts**

```ts
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';

export const firebaseAuth = auth();
export const firebaseFirestore = firestore();
export const firebaseStorage = storage();
export const firebaseMessaging = messaging;

export default {
  auth: firebaseAuth,
  firestore: firebaseFirestore,
  storage: firebaseStorage,
  messaging: firebaseMessaging,
};
```

- [ ] **Step 2 : Commit**

```bash
git add src/config/
git commit -m "feat: add Firebase config"
```

---

## Task 6 : Redux Store et Slices

**Files:**
- Create: `src/store/index.ts`
- Create: `src/store/slices/authSlice.ts`
- Create: `src/store/slices/feedSlice.ts`
- Create: `src/store/slices/playerSlice.ts`
- Create: `src/store/slices/uiSlice.ts`

- [ ] **Step 1 : Écrire les tests des slices**

Créer `__tests__/slices.test.ts` :

```ts
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
```

- [ ] **Step 2 : Run tests — confirmer FAIL**

```bash
npm test -- --testPathPattern="slices" --watchAll=false
```

Attendu : FAIL — modules not found.

- [ ] **Step 3 : Créer src/store/slices/authSlice.ts**

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isLoading = false;
    },
    clearUser(state) {
      state.user = null;
      state.isLoading = false;
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, clearUser, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
```

- [ ] **Step 4 : Créer src/store/slices/feedSlice.ts**

```ts
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
```

- [ ] **Step 5 : Créer src/store/slices/playerSlice.ts**

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayerState {
  currentIndex: number;
  isPaused: boolean;
}

const initialState: PlayerState = {
  currentIndex: 0,
  isPaused: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentIndex(state, action: PayloadAction<number>) {
      state.currentIndex = action.payload;
    },
    setPaused(state, action: PayloadAction<boolean>) {
      state.isPaused = action.payload;
    },
  },
});

export const { setCurrentIndex, setPaused } = playerSlice.actions;
export default playerSlice.reducer;
```

- [ ] **Step 6 : Créer src/store/slices/uiSlice.ts**

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  commentSheetVideoId: string | null;
  toastMessage: string | null;
  isUploadModalVisible: boolean;
}

const initialState: UIState = {
  commentSheetVideoId: null,
  toastMessage: null,
  isUploadModalVisible: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCommentSheetVideoId(state, action: PayloadAction<string | null>) {
      state.commentSheetVideoId = action.payload;
    },
    clearCommentSheet(state) {
      state.commentSheetVideoId = null;
    },
    showToast(state, action: PayloadAction<string>) {
      state.toastMessage = action.payload;
    },
    clearToast(state) {
      state.toastMessage = null;
    },
    setUploadModalVisible(state, action: PayloadAction<boolean>) {
      state.isUploadModalVisible = action.payload;
    },
  },
});

export const {
  setCommentSheetVideoId,
  clearCommentSheet,
  showToast,
  clearToast,
  setUploadModalVisible,
} = uiSlice.actions;
export default uiSlice.reducer;
```

- [ ] **Step 7 : Créer src/store/index.ts**

```ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import feedReducer from './slices/feedSlice';
import playerReducer from './slices/playerSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
    player: playerReducer,
    ui: uiReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser'],
        ignoredPaths: ['auth.user.createdAt'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

- [ ] **Step 8 : Créer src/store/hooks.ts**

```ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

- [ ] **Step 9 : Lancer les tests**

```bash
npm test -- --testPathPattern="slices" --watchAll=false
```

Attendu : 11 tests passent.

- [ ] **Step 10 : Commit**

```bash
git add src/store/ __tests__/slices.test.ts
git commit -m "feat: add Redux store with auth/feed/player/ui slices"
```

---

## Task 7 : Services Firebase

**Files:**
- Create: `src/services/firebase/auth.service.ts`
- Create: `src/services/firebase/users.service.ts`
- Create: `src/services/firebase/videos.service.ts`
- Create: `src/services/firebase/likes.service.ts`
- Create: `src/services/firebase/comments.service.ts`
- Create: `src/services/firebase/storage.service.ts`
- Create: `src/services/notifications.service.ts`

- [ ] **Step 1 : Créer src/services/firebase/auth.service.ts**

```ts
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { COLLECTIONS } from '../../utils/constants';
import { User } from '../../types';

export async function registerWithEmail(
  email: string,
  password: string,
  username: string,
  displayName: string,
): Promise<User> {
  const credential = await auth().createUserWithEmailAndPassword(email, password);
  const uid = credential.user.uid;

  const user: Omit<User, 'createdAt'> & { createdAt: any } = {
    uid,
    username,
    displayName,
    bio: '',
    avatar: '',
    followersCount: 0,
    followingCount: 0,
    videosCount: 0,
    isPrivate: false,
    isVerified: false,
    createdAt: firestore.FieldValue.serverTimestamp(),
  };

  await firestore().collection(COLLECTIONS.users).doc(uid).set(user);
  return user as unknown as User;
}

export async function loginWithEmail(email: string, password: string): Promise<void> {
  await auth().signInWithEmailAndPassword(email, password);
}

export async function logout(): Promise<void> {
  await auth().signOut();
}

export function onAuthStateChange(callback: (uid: string | null) => void): () => void {
  return auth().onAuthStateChanged(user => callback(user?.uid ?? null));
}

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const snap = await firestore()
    .collection(COLLECTIONS.users)
    .where('username', '==', username)
    .limit(1)
    .get();
  return snap.empty;
}
```

- [ ] **Step 2 : Créer src/services/firebase/users.service.ts**

```ts
import firestore from '@react-native-firebase/firestore';
import { COLLECTIONS, SUBCOLLECTIONS } from '../../utils/constants';
import { User } from '../../types';

export async function getUserById(uid: string): Promise<User | null> {
  const doc = await firestore().collection(COLLECTIONS.users).doc(uid).get();
  if (!doc.exists) return null;
  return doc.data() as User;
}

export function subscribeToUser(uid: string, callback: (user: User | null) => void): () => void {
  return firestore()
    .collection(COLLECTIONS.users)
    .doc(uid)
    .onSnapshot(snap => {
      callback(snap.exists ? (snap.data() as User) : null);
    });
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<Pick<User, 'displayName' | 'bio' | 'avatar'>>,
): Promise<void> {
  await firestore().collection(COLLECTIONS.users).doc(uid).update(updates);
}

export async function isFollowing(currentUid: string, targetUid: string): Promise<boolean> {
  const doc = await firestore()
    .collection(COLLECTIONS.users)
    .doc(currentUid)
    .collection(SUBCOLLECTIONS.following)
    .doc(targetUid)
    .get();
  return doc.exists;
}

export async function followUser(currentUid: string, targetUid: string): Promise<void> {
  const batch = firestore().batch();

  const followRef = firestore()
    .collection(COLLECTIONS.users)
    .doc(currentUid)
    .collection(SUBCOLLECTIONS.following)
    .doc(targetUid);

  const currentUserRef = firestore().collection(COLLECTIONS.users).doc(currentUid);
  const targetUserRef = firestore().collection(COLLECTIONS.users).doc(targetUid);

  batch.set(followRef, { followedAt: firestore.FieldValue.serverTimestamp() });
  batch.update(currentUserRef, { followingCount: firestore.FieldValue.increment(1) });
  batch.update(targetUserRef, { followersCount: firestore.FieldValue.increment(1) });

  await batch.commit();
}

export async function unfollowUser(currentUid: string, targetUid: string): Promise<void> {
  const batch = firestore().batch();

  const followRef = firestore()
    .collection(COLLECTIONS.users)
    .doc(currentUid)
    .collection(SUBCOLLECTIONS.following)
    .doc(targetUid);

  const currentUserRef = firestore().collection(COLLECTIONS.users).doc(currentUid);
  const targetUserRef = firestore().collection(COLLECTIONS.users).doc(targetUid);

  batch.delete(followRef);
  batch.update(currentUserRef, { followingCount: firestore.FieldValue.increment(-1) });
  batch.update(targetUserRef, { followersCount: firestore.FieldValue.increment(-1) });

  await batch.commit();
}
```

- [ ] **Step 3 : Créer src/services/firebase/videos.service.ts**

```ts
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { COLLECTIONS, FEED_PAGE_SIZE } from '../../utils/constants';
import { Video } from '../../types';

export async function fetchFeedVideos(
  lastDoc?: FirebaseFirestoreTypes.DocumentSnapshot,
): Promise<{ videos: Video[]; lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null }> {
  let query = firestore()
    .collection(COLLECTIONS.videos)
    .where('isPublic', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(FEED_PAGE_SIZE);

  if (lastDoc) {
    query = query.startAfter(lastDoc);
  }

  const snap = await query.get();
  const videos = snap.docs.map(d => d.data() as Video);
  const newLastDoc = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;

  return { videos, lastDoc: newLastDoc };
}

export async function getVideosByUser(uid: string): Promise<Video[]> {
  const snap = await firestore()
    .collection(COLLECTIONS.videos)
    .where('authorId', '==', uid)
    .orderBy('createdAt', 'desc')
    .get();
  return snap.docs.map(d => d.data() as Video);
}

export async function createVideoDocument(video: Omit<Video, 'createdAt'>): Promise<string> {
  const ref = firestore().collection(COLLECTIONS.videos).doc();
  const videoWithId = {
    ...video,
    videoId: ref.id,
    createdAt: firestore.FieldValue.serverTimestamp(),
  };
  await ref.set(videoWithId);

  await firestore()
    .collection(COLLECTIONS.users)
    .doc(video.authorId)
    .update({ videosCount: firestore.FieldValue.increment(1) });

  return ref.id;
}

export async function incrementVideoViews(videoId: string): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.videos)
    .doc(videoId)
    .update({ viewsCount: firestore.FieldValue.increment(1) });
}

export async function searchVideos(query: string): Promise<Video[]> {
  const snap = await firestore()
    .collection(COLLECTIONS.videos)
    .where('isPublic', '==', true)
    .orderBy('description')
    .startAt(query)
    .endAt(query + '')
    .limit(20)
    .get();
  return snap.docs.map(d => d.data() as Video);
}
```

- [ ] **Step 4 : Créer src/services/firebase/likes.service.ts**

```ts
import firestore from '@react-native-firebase/firestore';
import { COLLECTIONS, SUBCOLLECTIONS } from '../../utils/constants';

export async function toggleLike(
  videoId: string,
  uid: string,
  currentlyLiked: boolean,
): Promise<void> {
  const likeRef = firestore()
    .collection(COLLECTIONS.videos)
    .doc(videoId)
    .collection(SUBCOLLECTIONS.likes)
    .doc(uid);

  const videoRef = firestore().collection(COLLECTIONS.videos).doc(videoId);

  await firestore().runTransaction(async tx => {
    if (currentlyLiked) {
      tx.delete(likeRef);
      tx.update(videoRef, { likesCount: firestore.FieldValue.increment(-1) });
    } else {
      tx.set(likeRef, { uid, likedAt: firestore.FieldValue.serverTimestamp() });
      tx.update(videoRef, { likesCount: firestore.FieldValue.increment(1) });
    }
  });
}

export async function checkIsLiked(videoId: string, uid: string): Promise<boolean> {
  const doc = await firestore()
    .collection(COLLECTIONS.videos)
    .doc(videoId)
    .collection(SUBCOLLECTIONS.likes)
    .doc(uid)
    .get();
  return doc.exists;
}
```

- [ ] **Step 5 : Créer src/services/firebase/comments.service.ts**

```ts
import firestore from '@react-native-firebase/firestore';
import { COLLECTIONS, SUBCOLLECTIONS } from '../../utils/constants';
import { Comment } from '../../types';

export function subscribeToComments(
  videoId: string,
  callback: (comments: Comment[]) => void,
): () => void {
  return firestore()
    .collection(COLLECTIONS.videos)
    .doc(videoId)
    .collection(SUBCOLLECTIONS.comments)
    .orderBy('createdAt', 'desc')
    .onSnapshot(snap => {
      const comments = snap.docs.map(d => d.data() as Comment);
      callback(comments);
    });
}

export async function addComment(
  videoId: string,
  authorId: string,
  text: string,
): Promise<void> {
  const ref = firestore()
    .collection(COLLECTIONS.videos)
    .doc(videoId)
    .collection(SUBCOLLECTIONS.comments)
    .doc();

  const comment: Omit<Comment, 'createdAt'> & { createdAt: any } = {
    commentId: ref.id,
    authorId,
    text,
    likesCount: 0,
    createdAt: firestore.FieldValue.serverTimestamp(),
  };

  const batch = firestore().batch();
  batch.set(ref, comment);
  batch.update(firestore().collection(COLLECTIONS.videos).doc(videoId), {
    commentsCount: firestore.FieldValue.increment(1),
  });
  await batch.commit();
}

export async function deleteComment(videoId: string, commentId: string): Promise<void> {
  const batch = firestore().batch();
  const commentRef = firestore()
    .collection(COLLECTIONS.videos)
    .doc(videoId)
    .collection(SUBCOLLECTIONS.comments)
    .doc(commentId);

  batch.delete(commentRef);
  batch.update(firestore().collection(COLLECTIONS.videos).doc(videoId), {
    commentsCount: firestore.FieldValue.increment(-1),
  });
  await batch.commit();
}
```

- [ ] **Step 6 : Créer src/services/firebase/storage.service.ts**

```ts
import storage from '@react-native-firebase/storage';
import { STORAGE_PATHS } from '../../utils/constants';

export async function uploadVideo(
  uid: string,
  localUri: string,
  onProgress: (progress: number) => void,
): Promise<string> {
  const timestamp = Date.now();
  const path = STORAGE_PATHS.videos(uid, timestamp);
  const ref = storage().ref(path);

  const task = ref.putFile(localUri);

  task.on('state_changed', snapshot => {
    const progress = snapshot.bytesTransferred / snapshot.totalBytes;
    onProgress(Math.round(progress * 100));
  });

  await task;
  return await ref.getDownloadURL();
}

export async function uploadAvatar(uid: string, localUri: string): Promise<string> {
  const path = STORAGE_PATHS.avatars(uid);
  const ref = storage().ref(path);
  await ref.putFile(localUri);
  return await ref.getDownloadURL();
}

export async function deleteVideo(videoUrl: string): Promise<void> {
  await storage().refFromURL(videoUrl).delete();
}
```

- [ ] **Step 7 : Créer src/services/notifications.service.ts**

```ts
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import { COLLECTIONS, SUBCOLLECTIONS } from '../utils/constants';
import { Notification } from '../types';

export async function requestNotificationPermission(): Promise<boolean> {
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

export async function saveFCMToken(uid: string): Promise<void> {
  const token = await messaging().getToken();
  await firestore()
    .collection(COLLECTIONS.users)
    .doc(uid)
    .update({ fcmToken: token });
}

export function subscribeToNotifications(
  uid: string,
  callback: (notifications: Notification[]) => void,
): () => void {
  return firestore()
    .collection(COLLECTIONS.notifications)
    .doc(uid)
    .collection(SUBCOLLECTIONS.notifItems)
    .where('isRead', '==', false)
    .orderBy('createdAt', 'desc')
    .onSnapshot(snap => {
      callback(snap.docs.map(d => d.data() as Notification));
    });
}

export async function markNotificationRead(uid: string, notifId: string): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.notifications)
    .doc(uid)
    .collection(SUBCOLLECTIONS.notifItems)
    .doc(notifId)
    .update({ isRead: true });
}
```

- [ ] **Step 8 : Commit**

```bash
git add src/services/ src/config/
git commit -m "feat: add all Firebase services (auth, users, videos, likes, comments, storage, notifications)"
```

---

## Task 8 : Navigation et stubs de screens

**Files:**
- Create: `src/navigation/AppNavigator.tsx`
- Create: `src/navigation/AuthNavigator.tsx`
- Create: `src/navigation/MainNavigator.tsx`
- Create: `src/navigation/tabBarConfig.tsx`
- Create: stubs pour tous les screens

- [ ] **Step 1 : Créer les stubs de screens**

Créer chaque fichier avec ce pattern. Répète pour tous les screens listés :

`src/screens/auth/WelcomeScreen.tsx` :
```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>WelcomeScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  text: { color: colors.white },
});
```

Créer les mêmes stubs pour :
- `src/screens/auth/LoginScreen.tsx`
- `src/screens/auth/RegisterScreen.tsx`
- `src/screens/feed/HomeScreen.tsx`
- `src/screens/discover/DiscoverScreen.tsx`
- `src/screens/upload/CameraScreen.tsx`
- `src/screens/upload/PostScreen.tsx`
- `src/screens/inbox/InboxScreen.tsx`
- `src/screens/profile/ProfileScreen.tsx`
- `src/screens/profile/EditProfileScreen.tsx`

Changer le texte de `Text` pour correspondre au nom du screen.

- [ ] **Step 2 : Créer src/navigation/tabBarConfig.tsx**

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

export const TAB_BAR_HEIGHT = 56;

export function PlusTabIcon() {
  return (
    <View style={styles.plusContainer}>
      <View style={styles.plusLeft} />
      <View style={styles.plusCenter}>
        <View style={styles.plusIcon}>
          <View style={styles.plusHorizontal} />
          <View style={styles.plusVertical} />
        </View>
      </View>
      <View style={styles.plusRight} />
    </View>
  );
}

const styles = StyleSheet.create({
  plusContainer: {
    flexDirection: 'row',
    width: 44,
    height: 30,
    borderRadius: 8,
    overflow: 'hidden',
  },
  plusLeft: { flex: 1, backgroundColor: colors.secondary },
  plusCenter: { flex: 1.4, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' },
  plusRight: { flex: 1, backgroundColor: colors.primary },
  plusIcon: { width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  plusHorizontal: { position: 'absolute', width: 16, height: 2, backgroundColor: colors.background },
  plusVertical: { position: 'absolute', width: 2, height: 16, backgroundColor: colors.background },
});
```

- [ ] **Step 3 : Créer src/navigation/AuthNavigator.tsx**

```tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
```

- [ ] **Step 4 : Créer src/navigation/MainNavigator.tsx**

```tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/feed/HomeScreen';
import DiscoverScreen from '../screens/discover/DiscoverScreen';
import CameraScreen from '../screens/upload/CameraScreen';
import InboxScreen from '../screens/inbox/InboxScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { PlusTabIcon } from './tabBarConfig';
import { colors } from '../theme';

export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  Camera: undefined;
  Inbox: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.gray,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="home" size={26} color={color} />,
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="search" size={26} color={color} />,
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarIcon: () => <PlusTabIcon />,
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={InboxScreen}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="chatbubble-outline" size={26} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={26} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopColor: colors.grayLight,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 56,
  },
});
```

- [ ] **Step 5 : Créer src/navigation/AppNavigator.tsx**

```tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUser, clearUser, setAuthLoading } from '../store/slices/authSlice';
import { onAuthStateChange } from '../services/firebase/auth.service';
import { getUserById } from '../services/firebase/users.service';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function AppNavigator() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector(s => s.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async uid => {
      if (uid) {
        const userData = await getUserById(uid);
        if (userData) dispatch(setUser(userData));
        else dispatch(clearUser());
      } else {
        dispatch(clearUser());
      }
    });
    return unsubscribe;
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
});
```

- [ ] **Step 6 : Mettre à jour App.tsx**

Remplacer le contenu de `App.tsx` :

```tsx
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          <AppNavigator />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

- [ ] **Step 7 : Lancer l'app Android**

```bash
npm run android
```

Attendu : l'app démarre, l'écran de chargement s'affiche (ActivityIndicator rouge), puis le WelcomeScreen stub apparaît (aucun user connecté).

- [ ] **Step 8 : Commit**

```bash
git add src/navigation/ src/screens/ App.tsx
git commit -m "feat: add navigation structure and screen stubs"
```

---

**Phase 1 terminée.** L'infrastructure complète est en place : thème, utils, types, Firebase config, Redux store, services Firebase, navigation fonctionnelle avec stubs.

Passer au plan Phase 2 : `2026-05-31-tiktok-clone-phase2.md`
