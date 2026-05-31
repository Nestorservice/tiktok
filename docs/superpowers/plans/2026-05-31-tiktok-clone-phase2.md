# TikTok Clone — Plan Phase 2 : Auth + Feed + Comments

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Prérequis:** Phase 1 complète (store, services, navigation, stubs en place).

**Goal:** Implémenter l'auth complète (Welcome/Login/Register), le feed vidéo principal avec autoplay/like/double-tap, et les commentaires.

**Architecture:** Auth flow → AppNavigator redirige vers MainNavigator une fois connecté. Le feed charge les vidéos via feedSlice et les affiche dans un FlatList plein écran. Les commentaires s'ouvrent dans un BottomSheet.

---

## Task 9 : Hook useAuth

**Files:**
- Create: `src/hooks/useAuth.ts`

- [ ] **Step 1 : Créer src/hooks/useAuth.ts**

```ts
import { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { clearUser } from '../store/slices/authSlice';
import {
  loginWithEmail,
  registerWithEmail,
  logout,
  checkUsernameAvailable,
} from '../services/firebase/auth.service';
import { AUTH_ERRORS } from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuth() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function mapError(code: string): string {
    return AUTH_ERRORS[code] ?? 'Une erreur est survenue';
  }

  async function login(email: string, password: string): Promise<boolean> {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithEmail(email, password);
      return true;
    } catch (e: any) {
      setError(mapError(e.code));
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function register(
    email: string,
    password: string,
    username: string,
    displayName: string,
  ): Promise<boolean> {
    setIsLoading(true);
    setError(null);
    try {
      const available = await checkUsernameAvailable(username);
      if (!available) {
        setError("Ce nom d'utilisateur est déjà pris");
        return false;
      }
      await registerWithEmail(email, password, username, displayName);
      return true;
    } catch (e: any) {
      setError(mapError(e.code));
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut(): Promise<void> {
    await logout();
    await AsyncStorage.clear();
    dispatch(clearUser());
  }

  return { login, register, signOut, isLoading, error, setError };
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/hooks/useAuth.ts
git commit -m "feat: add useAuth hook"
```

---

## Task 10 : Screens d'authentification

**Files:**
- Modify: `src/screens/auth/WelcomeScreen.tsx`
- Modify: `src/screens/auth/LoginScreen.tsx`
- Modify: `src/screens/auth/RegisterScreen.tsx`

- [ ] **Step 1 : Implémenter WelcomeScreen.tsx**

```tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Nav = StackNavigationProp<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>TikTok</Text>
        <Text style={styles.tagline}>Make Your Day</Text>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.8}>
          <Text style={styles.btnPrimaryText}>Utiliser téléphone ou email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          activeOpacity={0.8}>
          <Text style={styles.btnSecondaryText}>Continuer avec Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          activeOpacity={0.8}>
          <Text style={styles.btnSecondaryText}>Continuer avec Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.loginRow}>
          <Text style={styles.loginText}>
            Déjà un compte ?{' '}
            <Text style={styles.loginLink}>Se connecter</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          En continuant, tu acceptes nos Conditions d'utilisation et notre Politique de confidentialité.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: {
    fontSize: 32,
    fontWeight: typography.bold,
    color: colors.white,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: typography.lg,
    color: colors.gray,
    marginTop: spacing.sm,
  },
  bottom: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  btnPrimary: {
    backgroundColor: colors.white,
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: colors.background,
    fontWeight: typography.bold,
    fontSize: typography.base,
  },
  btnSecondary: {
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSecondaryText: { color: colors.white, fontSize: typography.base },
  loginRow: { alignItems: 'center', marginTop: spacing.sm },
  loginText: { color: colors.white, fontSize: typography.md },
  loginLink: { textDecorationLine: 'underline' },
  terms: {
    color: colors.gray,
    fontSize: typography.xs,
    textAlign: 'center',
    lineHeight: 16,
  },
});
```

- [ ] **Step 2 : Implémenter LoginScreen.tsx**

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../hooks/useAuth';

type Nav = StackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    if (!email || !password) return;
    await login(email.trim(), password);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Connexion</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.gray}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor={colors.gray}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.forgot}>
          <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitBtn, (!email || !password) && styles.submitDisabled]}
          onPress={handleLogin}
          disabled={isLoading || !email || !password}
          activeOpacity={0.8}>
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.submitText}>Se connecter</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  back: { marginBottom: spacing.xl },
  backText: { color: colors.white, fontSize: typography.xl },
  title: { fontSize: 22, fontWeight: typography.bold, color: colors.white, marginBottom: spacing.xl },
  errorText: { color: colors.primary, fontSize: typography.sm, marginBottom: spacing.md },
  input: {
    backgroundColor: colors.surfaceLight,
    color: colors.white,
    height: 50,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    fontSize: typography.base,
    marginBottom: spacing.md,
  },
  forgot: { alignSelf: 'flex-end', marginBottom: spacing.xl },
  forgotText: { color: colors.white, fontSize: 13 },
  submitBtn: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: colors.white, fontWeight: typography.bold, fontSize: typography.base },
});
```

- [ ] **Step 3 : Implémenter RegisterScreen.tsx**

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing } from '../../theme';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail, isValidPassword, isValidUsername } from '../../utils/validators';

type Nav = StackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { register, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');

  const isFormValid =
    isValidEmail(email) &&
    isValidUsername(username) &&
    isValidPassword(password) &&
    displayName.length > 0;

  async function handleRegister() {
    if (!isFormValid) return;
    await register(email.trim(), password, username.trim().toLowerCase(), displayName.trim());
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Créer un compte</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Nom d'affichage"
          placeholderTextColor={colors.gray}
          value={displayName}
          onChangeText={setDisplayName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nom d'utilisateur (@handle)"
          placeholderTextColor={colors.gray}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.gray}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe (min. 6 caractères)"
          placeholderTextColor={colors.gray}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.submitBtn, !isFormValid && styles.submitDisabled]}
          onPress={handleRegister}
          disabled={isLoading || !isFormValid}
          activeOpacity={0.8}>
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.submitText}>Créer le compte</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginRow}>
          <Text style={styles.loginText}>
            Déjà un compte ? <Text style={styles.loginLink}>Se connecter</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  back: { marginBottom: spacing.xl },
  backText: { color: colors.white, fontSize: typography.xl },
  title: { fontSize: 22, fontWeight: typography.bold, color: colors.white, marginBottom: spacing.xl },
  errorText: { color: colors.primary, fontSize: typography.sm, marginBottom: spacing.md },
  input: {
    backgroundColor: colors.surfaceLight,
    color: colors.white,
    height: 50,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    fontSize: typography.base,
    marginBottom: spacing.md,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: colors.white, fontWeight: typography.bold, fontSize: typography.base },
  loginRow: { alignItems: 'center', marginTop: spacing.xl },
  loginText: { color: colors.white, fontSize: typography.md },
  loginLink: { textDecorationLine: 'underline' },
});
```

- [ ] **Step 4 : Tester le flow auth sur device**

```bash
npm run android
```

Attendu : WelcomeScreen → RegisterScreen → (après inscription) HomeScreen stub. WelcomeScreen → LoginScreen → (après login) HomeScreen stub.

- [ ] **Step 5 : Commit**

```bash
git add src/screens/auth/ src/hooks/useAuth.ts
git commit -m "feat: implement auth screens (Welcome, Login, Register) and useAuth hook"
```

---

## Task 11 : Hooks useDoubleTap et useVideoPlayer

**Files:**
- Create: `src/hooks/useDoubleTap.ts`
- Create: `src/hooks/useVideoPlayer.ts`

- [ ] **Step 1 : Créer src/hooks/useDoubleTap.ts**

```ts
import { useRef, useCallback } from 'react';
import { DOUBLE_TAP_DELAY } from '../utils/constants';

export function useDoubleTap(
  onSingleTap: () => void,
  onDoubleTap: () => void,
) {
  const lastTap = useRef<number>(0);

  const handleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      lastTap.current = 0;
      onDoubleTap();
    } else {
      lastTap.current = now;
      setTimeout(() => {
        if (lastTap.current !== 0 && Date.now() - lastTap.current >= DOUBLE_TAP_DELAY) {
          lastTap.current = 0;
          onSingleTap();
        }
      }, DOUBLE_TAP_DELAY);
    }
  }, [onSingleTap, onDoubleTap]);

  return handleTap;
}
```

- [ ] **Step 2 : Créer src/hooks/useVideoPlayer.ts**

```ts
import { useRef, useCallback, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrentIndex, setPaused } from '../store/slices/playerSlice';
import { appendVideos, setLoading, setHasMore, setLastDocId, setError } from '../store/slices/feedSlice';
import { fetchFeedVideos } from '../services/firebase/videos.service';
import { getUserById } from '../services/firebase/users.service';
import { checkIsLiked } from '../services/firebase/likes.service';
import { FEED_PREFETCH_THRESHOLD, FEED_PAGE_SIZE } from '../utils/constants';
import { VideoWithAuthor } from '../types';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export function useVideoPlayer() {
  const dispatch = useAppDispatch();
  const { currentIndex, isPaused } = useAppSelector(s => s.player);
  const { videos, hasMore, lastDocId } = useAppSelector(s => s.feed);
  const currentUid = useAppSelector(s => s.auth.user?.uid);
  const lastDocRef = useRef<FirebaseFirestoreTypes.DocumentSnapshot | null>(null);
  const isFetching = useRef(false);

  const loadVideos = useCallback(async (isInitial = false) => {
    if (isFetching.current || (!isInitial && !hasMore)) return;
    isFetching.current = true;
    dispatch(setLoading(true));

    try {
      const cursor = isInitial ? undefined : lastDocRef.current ?? undefined;
      const { videos: newVideos, lastDoc } = await fetchFeedVideos(cursor);

      if (newVideos.length < FEED_PAGE_SIZE) dispatch(setHasMore(false));

      lastDocRef.current = lastDoc;
      if (lastDoc) dispatch(setLastDocId(lastDoc.id));

      const enriched: VideoWithAuthor[] = await Promise.all(
        newVideos.map(async v => {
          const author = await getUserById(v.authorId);
          const isLiked = currentUid ? await checkIsLiked(v.videoId, currentUid) : false;
          return { ...v, author: author!, isLiked, isFollowing: false };
        }),
      );

      dispatch(appendVideos(enriched));
    } catch {
      dispatch(setError('Impossible de charger les vidéos'));
    } finally {
      isFetching.current = false;
    }
  }, [dispatch, hasMore, currentUid]);

  useEffect(() => {
    loadVideos(true);
  }, []);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        const idx = viewableItems[0].index;
        dispatch(setCurrentIndex(idx));
        if (idx >= videos.length - FEED_PREFETCH_THRESHOLD) {
          loadVideos();
        }
      }
    },
    [dispatch, videos.length, loadVideos],
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(setPaused(false));
      return () => dispatch(setPaused(true));
    }, [dispatch]),
  );

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      dispatch(setPaused(state !== 'active'));
    });
    return () => sub.remove();
  }, [dispatch]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  });

  return {
    currentIndex,
    isPaused,
    onViewableItemsChanged,
    viewabilityConfig: viewabilityConfig.current,
    loadMore: () => loadVideos(),
  };
}
```

- [ ] **Step 3 : Commit**

```bash
git add src/hooks/useDoubleTap.ts src/hooks/useVideoPlayer.ts
git commit -m "feat: add useDoubleTap and useVideoPlayer hooks"
```

---

## Task 12 : Hook useLike

**Files:**
- Create: `src/hooks/useLike.ts`

- [ ] **Step 1 : Créer src/hooks/useLike.ts**

```ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateVideoLike } from '../store/slices/feedSlice';
import { toggleLike } from '../services/firebase/likes.service';

export function useLike() {
  const dispatch = useAppDispatch();
  const uid = useAppSelector(s => s.auth.user?.uid);

  const like = useCallback(
    async (videoId: string, currentlyLiked: boolean) => {
      if (!uid) return;

      // Optimistic update
      dispatch(updateVideoLike({
        videoId,
        isLiked: !currentlyLiked,
        delta: currentlyLiked ? -1 : 1,
      }));

      try {
        await toggleLike(videoId, uid, currentlyLiked);
      } catch {
        // Revert on failure
        dispatch(updateVideoLike({
          videoId,
          isLiked: currentlyLiked,
          delta: currentlyLiked ? 1 : -1,
        }));
      }
    },
    [dispatch, uid],
  );

  return { like };
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/hooks/useLike.ts
git commit -m "feat: add useLike hook with optimistic update"
```

---

## Task 13 : Composants du feed

**Files:**
- Create: `src/components/feed/MusicDisc.tsx`
- Create: `src/components/feed/DoubleTapLike.tsx`
- Create: `src/components/feed/FollowButton.tsx`
- Create: `src/components/feed/VideoInfo.tsx`
- Create: `src/components/feed/VideoActions.tsx`
- Create: `src/components/feed/VideoItem.tsx`

- [ ] **Step 1 : Créer src/components/feed/MusicDisc.tsx**

```tsx
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import FastImage from 'react-native-fast-image';
import { colors, spacing } from '../../theme';
import { MUSIC_DISC_DURATION } from '../../utils/constants';

interface Props {
  thumbnailUrl: string;
  isPlaying: boolean;
}

export default function MusicDisc({ thumbnailUrl, isPlaying }: Props) {
  const rotation = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);
  const currentAngle = useRef(0);

  useEffect(() => {
    rotation.addListener(({ value }) => {
      currentAngle.current = value;
    });
    return () => rotation.removeAllListeners();
  }, [rotation]);

  useEffect(() => {
    if (isPlaying) {
      animRef.current = Animated.loop(
        Animated.timing(rotation, {
          toValue: currentAngle.current + 1,
          duration: MUSIC_DISC_DURATION,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      animRef.current.start();
    } else {
      animRef.current?.stop();
    }
  }, [isPlaying, rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.disc, { transform: [{ rotate: spin }] }]}>
      <FastImage
        source={{ uri: thumbnailUrl || undefined }}
        style={styles.image}
        defaultSource={require('../../assets/icons/disc-placeholder.png')}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  disc: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: colors.grayLight,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
});
```

- [ ] **Step 2 : Créer src/components/feed/DoubleTapLike.tsx**

```tsx
import React, { useRef, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import LottieView from 'lottie-react-native';

interface Props {
  visible: boolean;
  x: number;
  y: number;
  onAnimationFinish: () => void;
}

export default function DoubleTapLike({ visible, x, y, onAnimationFinish }: Props) {
  if (!visible) return null;

  return (
    <View
      style={[styles.container, { left: x - 75, top: y - 75 }]}
      pointerEvents="none">
      <LottieView
        source={require('../../assets/animations/heart.json')}
        autoPlay
        loop={false}
        style={styles.lottie}
        onAnimationFinish={onAnimationFinish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 150,
    height: 150,
    zIndex: 999,
  },
  lottie: { width: 150, height: 150 },
});
```

- [ ] **Step 3 : Créer src/components/feed/FollowButton.tsx**

```tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, typography, spacing } from '../../theme';

interface Props {
  isFollowing: boolean;
  onPress: () => void;
}

export default function FollowButton({ isFollowing, onPress }: Props) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePress() {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    onPress();
  }

  if (isFollowing) return null;

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={1}>
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: { color: colors.white, fontSize: 14, fontWeight: typography.bold, lineHeight: 18 },
});
```

- [ ] **Step 4 : Créer src/components/feed/VideoInfo.tsx**

```tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, typography, spacing } from '../../theme';
import { VideoWithAuthor } from '../../types';

interface Props {
  video: VideoWithAuthor;
}

export default function VideoInfo({ video }: Props) {
  const hashtags = video.hashtags ?? [];

  return (
    <View style={styles.container}>
      <Text style={styles.username}>@{video.author?.username ?? ''}</Text>

      <Text style={styles.description} numberOfLines={2}>
        {video.description}{' '}
        {hashtags.map(tag => (
          <Text key={tag} style={styles.hashtag}>#{tag} </Text>
        ))}
      </Text>

      <View style={styles.musicRow}>
        <Ionicons name="musical-notes" size={14} color={colors.white} />
        <Text style={styles.musicText} numberOfLines={1}>
          {' '}
          {video.musicName || `Son original — @${video.author?.username ?? ''}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: spacing.lg,
    right: 80,
  },
  username: {
    color: colors.white,
    fontWeight: typography.bold,
    fontSize: typography.base,
    marginBottom: spacing.xs,
  },
  description: {
    color: colors.white,
    fontSize: typography.sm,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  hashtag: {
    color: colors.white,
    fontWeight: typography.bold,
  },
  musicRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicText: {
    color: colors.white,
    fontSize: typography.sm,
    flex: 1,
  },
});
```

- [ ] **Step 5 : Créer src/components/feed/VideoActions.tsx**

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import { colors, typography, spacing } from '../../theme';
import { VideoWithAuthor } from '../../types';
import { formatNumber } from '../../utils/formatNumber';
import FollowButton from './FollowButton';
import MusicDisc from './MusicDisc';

interface Props {
  video: VideoWithAuthor;
  isPlaying: boolean;
  onLike: () => void;
  onComment: () => void;
  onFollow: () => void;
  onShare: () => void;
}

export default function VideoActions({
  video,
  isPlaying,
  onLike,
  onComment,
  onFollow,
  onShare,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <FastImage
          source={{ uri: video.author?.avatar || undefined }}
          style={styles.avatar}
        />
        <FollowButton isFollowing={video.isFollowing} onPress={onFollow} />
      </View>

      <TouchableOpacity style={styles.action} onPress={onLike} activeOpacity={0.7}>
        <Ionicons
          name={video.isLiked ? 'heart' : 'heart-outline'}
          size={36}
          color={video.isLiked ? colors.primary : colors.white}
        />
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

      <MusicDisc
        thumbnailUrl={video.thumbnailUrl}
        isPlaying={isPlaying}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 12,
    bottom: 80,
    alignItems: 'center',
    gap: 20,
  },
  avatarContainer: { position: 'relative', marginBottom: spacing.sm },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  action: { alignItems: 'center' },
  count: {
    color: colors.white,
    fontSize: typography.sm,
    fontWeight: typography.bold,
    marginTop: 2,
  },
  shareLabel: { color: colors.white, fontSize: 11, marginTop: 2 },
});
```

- [ ] **Step 6 : Créer src/components/feed/VideoItem.tsx**

```tsx
import React, { memo, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';
import { VideoWithAuthor } from '../../types';
import VideoActions from './VideoActions';
import VideoInfo from './VideoInfo';
import DoubleTapLike from './DoubleTapLike';
import { useDoubleTap } from '../../hooks/useDoubleTap';
import { useLike } from '../../hooks/useLike';
import { useAppDispatch } from '../../store/hooks';
import { setCommentSheetVideoId } from '../../store/slices/uiSlice';
import { useFollow } from '../../hooks/useFollow';
import Share from 'react-native-share';

const { width, height } = Dimensions.get('window');

interface Props {
  video: VideoWithAuthor;
  isActive: boolean;
  isPausedGlobal: boolean;
}

function VideoItem({ video, isActive, isPausedGlobal }: Props) {
  const dispatch = useAppDispatch();
  const { like } = useLike();
  const { follow } = useFollow();
  const [manualPause, setManualPause] = useState(false);
  const [heartVisible, setHeartVisible] = useState(false);
  const [heartPos, setHeartPos] = useState({ x: width / 2, y: height / 2 });

  const isPaused = !isActive || isPausedGlobal || manualPause;

  const handleSingleTap = useCallback(() => {
    setManualPause(p => !p);
  }, []);

  const handleDoubleTap = useCallback(() => {
    if (!video.isLiked) {
      like(video.videoId, false);
    }
    setHeartVisible(true);
  }, [video.isLiked, video.videoId, like]);

  const handleTap = useDoubleTap(handleSingleTap, handleDoubleTap);

  const handlePress = useCallback(
    (evt: any) => {
      setHeartPos({ x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY });
      handleTap();
    },
    [handleTap],
  );

  const handleComment = useCallback(() => {
    dispatch(setCommentSheetVideoId(video.videoId));
  }, [dispatch, video.videoId]);

  const handleFollow = useCallback(() => {
    follow(video.author.uid, false);
  }, [follow, video.author.uid]);

  const handleShare = useCallback(async () => {
    try {
      await Share.open({ url: video.videoUrl, title: video.description });
    } catch {}
  }, [video.videoUrl, video.description]);

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        {isActive && (
          <Video
            source={{ uri: video.videoUrl }}
            style={styles.video}
            resizeMode="cover"
            repeat
            paused={isPaused}
            muted={false}
            ignoreSilentSwitch="obey"
          />
        )}

        <VideoInfo video={video} />

        <VideoActions
          video={video}
          isPlaying={!isPaused}
          onLike={() => like(video.videoId, video.isLiked)}
          onComment={handleComment}
          onFollow={handleFollow}
          onShare={handleShare}
        />

        <DoubleTapLike
          visible={heartVisible}
          x={heartPos.x}
          y={heartPos.y}
          onAnimationFinish={() => setHeartVisible(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default memo(VideoItem);

const styles = StyleSheet.create({
  container: { width, height, backgroundColor: '#000' },
  video: { ...StyleSheet.absoluteFillObject },
});
```

- [ ] **Step 7 : Commit**

```bash
git add src/components/feed/
git commit -m "feat: add feed components (VideoItem, VideoActions, VideoInfo, MusicDisc, DoubleTapLike, FollowButton)"
```

---

## Task 14 : Hook useFollow

**Files:**
- Create: `src/hooks/useFollow.ts`

- [ ] **Step 1 : Créer src/hooks/useFollow.ts**

```ts
import { useCallback } from 'react';
import { useAppSelector } from '../store/hooks';
import { followUser, unfollowUser } from '../services/firebase/users.service';

export function useFollow() {
  const currentUid = useAppSelector(s => s.auth.user?.uid);

  const follow = useCallback(
    async (targetUid: string, isFollowing: boolean) => {
      if (!currentUid || currentUid === targetUid) return;
      if (isFollowing) {
        await unfollowUser(currentUid, targetUid);
      } else {
        await followUser(currentUid, targetUid);
      }
    },
    [currentUid],
  );

  return { follow };
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/hooks/useFollow.ts
git commit -m "feat: add useFollow hook"
```

---

## Task 15 : HomeScreen

**Files:**
- Modify: `src/screens/feed/HomeScreen.tsx`

- [ ] **Step 1 : Implémenter HomeScreen.tsx**

```tsx
import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Text,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '../../store/hooks';
import { useVideoPlayer } from '../../hooks/useVideoPlayer';
import VideoItem from '../../components/feed/VideoItem';
import { VideoWithAuthor } from '../../types';
import { colors, typography } from '../../theme';
import CommentSheet from '../../components/comments/CommentSheet';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const { videos, isLoading } = useAppSelector(s => s.feed);
  const { currentIndex, isPaused, onViewableItemsChanged, viewabilityConfig } =
    useVideoPlayer();
  const commentVideoId = useAppSelector(s => s.ui.commentSheetVideoId);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: height,
      offset: height * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: VideoWithAuthor; index: number }) => (
      <VideoItem
        video={item}
        isActive={index === currentIndex}
        isPausedGlobal={isPaused}
      />
    ),
    [currentIndex, isPaused],
  );

  const keyExtractor = useCallback((item: VideoWithAuthor) => item.videoId, []);

  if (isLoading && videos.length === 0) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        removeClippedSubviews
        maxToRenderPerBatch={3}
        windowSize={5}
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune vidéo pour le moment</Text>
          </View>
        }
      />

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
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 12,
    gap: 20,
    zIndex: 10,
  },
  tab: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: typography.lg,
    fontWeight: typography.bold,
  },
  tabActive: {
    color: colors.white,
    borderBottomWidth: 2,
    borderBottomColor: colors.white,
    paddingBottom: 2,
  },
  empty: { height, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: colors.gray },
});
```

- [ ] **Step 2 : Commit**

```bash
git add src/screens/feed/HomeScreen.tsx
git commit -m "feat: implement HomeScreen with video feed and autoplay"
```

---

## Task 16 : Composants Comments et CommentSheet

**Files:**
- Create: `src/components/comments/CommentItem.tsx`
- Create: `src/components/comments/CommentInput.tsx`
- Create: `src/components/comments/CommentSheet.tsx`

- [ ] **Step 1 : Créer src/components/comments/CommentItem.tsx**

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, typography, spacing } from '../../theme';
import { Comment, User } from '../../types';
import { formatNumber } from '../../utils/formatNumber';

interface Props {
  comment: Comment;
  author: User | null;
}

export default function CommentItem({ comment, author }: Props) {
  return (
    <View style={styles.container}>
      <FastImage
        source={{ uri: author?.avatar || undefined }}
        style={styles.avatar}
      />
      <View style={styles.content}>
        <Text style={styles.username}>{author?.username ?? 'utilisateur'}</Text>
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
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
  },
  content: { flex: 1, marginLeft: spacing.md },
  username: { color: colors.white, fontWeight: typography.bold, fontSize: 13 },
  text: { color: colors.white, fontSize: 13, marginTop: 2, lineHeight: 18 },
  time: { color: colors.gray, fontSize: typography.xs, marginTop: spacing.xs },
  likeBtn: { alignItems: 'center', marginLeft: spacing.sm },
  likeCount: { color: colors.gray, fontSize: typography.xs, marginTop: 2 },
});
```

- [ ] **Step 2 : Créer src/components/comments/CommentInput.tsx**

```tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import { colors, spacing } from '../../theme';
import { useAppSelector } from '../../store/hooks';
import { addComment } from '../../services/firebase/comments.service';

interface Props {
  videoId: string;
}

export default function CommentInput({ videoId }: Props) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const user = useAppSelector(s => s.auth.user);

  async function handleSend() {
    if (!text.trim() || !user || sending) return;
    setSending(true);
    try {
      await addComment(videoId, user.uid, text.trim());
      setText('');
    } finally {
      setSending(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={60}>
      <View style={styles.container}>
        <FastImage source={{ uri: user?.avatar || undefined }} style={styles.avatar} />
        <TextInput
          style={styles.input}
          placeholder="Ajouter un commentaire..."
          placeholderTextColor={colors.gray}
          value={text}
          onChangeText={setText}
          multiline={false}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity onPress={handleSend} disabled={!text.trim() || sending}>
          <Ionicons
            name="send"
            size={22}
            color={text.trim() ? colors.primary : colors.gray}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.grayLight,
    backgroundColor: colors.surface,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceLight,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    color: colors.white,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    fontSize: 14,
    marginRight: spacing.sm,
    maxHeight: 80,
  },
});
```

- [ ] **Step 3 : Créer src/components/comments/CommentSheet.tsx**

```tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useAppDispatch } from '../../store/hooks';
import { clearCommentSheet } from '../../store/slices/uiSlice';
import { subscribeToComments } from '../../services/firebase/comments.service';
import { getUserById } from '../../services/firebase/users.service';
import { Comment, User } from '../../types';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import { colors, typography, spacing } from '../../theme';
import { formatNumber } from '../../utils/formatNumber';

interface Props {
  videoId: string;
}

export default function CommentSheet({ videoId }: Props) {
  const dispatch = useAppDispatch();
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['70%', '95%'];
  const [comments, setComments] = useState<Comment[]>([]);
  const [authors, setAuthors] = useState<Record<string, User>>({});

  useEffect(() => {
    const unsubscribe = subscribeToComments(videoId, async newComments => {
      setComments(newComments);
      const missing = newComments
        .filter(c => !authors[c.authorId])
        .map(c => c.authorId);
      const uniqueMissing = [...new Set(missing)];
      if (uniqueMissing.length > 0) {
        const fetched = await Promise.all(uniqueMissing.map(uid => getUserById(uid)));
        setAuthors(prev => {
          const next = { ...prev };
          uniqueMissing.forEach((uid, i) => {
            if (fetched[i]) next[uid] = fetched[i]!;
          });
          return next;
        });
      }
    });
    return unsubscribe;
  }, [videoId]);

  const handleClose = useCallback(() => {
    dispatch(clearCommentSheet());
  }, [dispatch]);

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      onClose={handleClose}
      enablePanDownToClose
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}>
      <View style={styles.header}>
        <Text style={styles.title}>{formatNumber(comments.length)} commentaires</Text>
      </View>

      <BottomSheetFlatList
        data={comments}
        keyExtractor={item => item.commentId}
        renderItem={({ item }) => (
          <CommentItem comment={item} author={authors[item.authorId] ?? null} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Soyez le premier à commenter</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <CommentInput videoId={videoId} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: { backgroundColor: colors.surface, borderRadius: 16 },
  handle: { backgroundColor: colors.gray, width: 40, height: 4 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.grayLight,
  },
  title: { color: colors.white, fontWeight: typography.bold, fontSize: typography.base },
  empty: { padding: spacing.xxxl, alignItems: 'center' },
  emptyText: { color: colors.gray },
});
```

- [ ] **Step 4 : Tester le feed sur device**

```bash
npm run android
```

Attendu : Feed charge les vidéos, scrolling plein écran, tap = pause/play, double tap = like avec animation, sidebar like/comment/share visible, bouton comment ouvre le BottomSheet.

- [ ] **Step 5 : Commit**

```bash
git add src/components/comments/ src/hooks/useLike.ts src/hooks/useFollow.ts
git commit -m "feat: add comments system (CommentSheet, CommentItem, CommentInput)"
```

---

**Phase 2 terminée.** Auth flow complet + feed vidéo avec autoplay + likes optimistes + commentaires en temps réel.

Passer au plan Phase 3 : `2026-05-31-tiktok-clone-phase3.md`
