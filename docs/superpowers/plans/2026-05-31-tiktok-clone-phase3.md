# TikTok Clone — Plan Phase 3 : Caméra, Discover, Profil, Inbox, Communs, Seed

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Prérequis:** Phase 1 + Phase 2 complètes.

**Goal:** Implémenter les screens restants (Camera, Post, Discover, Profile, Inbox), les composants communs, le hook useUpload, et le script de seed.

---

## Task 17 : Hook useUpload + CameraScreen + PostScreen

**Files:**
- Create: `src/hooks/useUpload.ts`
- Modify: `src/screens/upload/CameraScreen.tsx`
- Modify: `src/screens/upload/PostScreen.tsx`

- [ ] **Step 1 : Créer src/hooks/useUpload.ts**

```ts
import { useState, useCallback } from 'react';
import { Video as CompressorVideo } from 'react-native-compressor';
import { uploadVideo } from '../services/firebase/storage.service';
import { createVideoDocument } from '../services/firebase/videos.service';
import { useAppSelector } from '../store/hooks';

interface UploadParams {
  localUri: string;
  description: string;
  hashtags: string[];
  musicName: string;
  duration: number;
  thumbnailUrl: string;
}

export function useUpload() {
  const uid = useAppSelector(s => s.auth.user?.uid);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (params: UploadParams): Promise<boolean> => {
      if (!uid) return false;
      setIsUploading(true);
      setError(null);
      setProgress(0);

      try {
        const compressed = await CompressorVideo.compress(params.localUri, {
          compressionMethod: 'auto',
        });

        const videoUrl = await uploadVideo(uid, compressed, pct => setProgress(pct));

        await createVideoDocument({
          videoId: '',
          authorId: uid,
          videoUrl,
          thumbnailUrl: params.thumbnailUrl,
          description: params.description,
          hashtags: params.hashtags,
          musicName: params.musicName,
          likesCount: 0,
          commentsCount: 0,
          sharesCount: 0,
          viewsCount: 0,
          duration: params.duration,
          isPublic: true,
        });

        return true;
      } catch (e: any) {
        setError('Échec de la publication. Réessaie.');
        return false;
      } finally {
        setIsUploading(false);
      }
    },
    [uid],
  );

  return { upload, progress, isUploading, error };
}
```

- [ ] **Step 2 : Implémenter CameraScreen.tsx**

```tsx
import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing } from '../../theme';

type Speed = '0.3x' | '0.5x' | '1x' | '2x' | '3x';
const SPEEDS: Speed[] = ['0.3x', '0.5x', '1x', '2x', '3x'];

export default function CameraScreen() {
  const navigation = useNavigation<any>();
  const device = useCameraDevice('back');
  const { hasPermission: hasCam, requestPermission: reqCam } = useCameraPermission();
  const { hasPermission: hasMic, requestPermission: reqMic } = useMicrophonePermission();
  const cameraRef = useRef<Camera>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [speed, setSpeed] = useState<Speed>('1x');

  const requestPermissions = useCallback(async () => {
    if (!hasCam) await reqCam();
    if (!hasMic) await reqMic();
  }, [hasCam, hasMic, reqCam, reqMic]);

  React.useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  const startRecording = useCallback(async () => {
    if (!cameraRef.current) return;
    setIsRecording(true);
    cameraRef.current.startRecording({
      onRecordingFinished: video => {
        setIsRecording(false);
        navigation.navigate('Post', { videoUri: video.path, duration: video.duration });
      },
      onRecordingError: () => {
        setIsRecording(false);
        Alert.alert('Erreur', "L'enregistrement a échoué");
      },
    });
  }, [navigation]);

  const stopRecording = useCallback(async () => {
    await cameraRef.current?.stopRecording();
  }, []);

  const flipCamera = useCallback(() => {
    setFacing(f => (f === 'back' ? 'front' : 'back'));
  }, []);

  const backDevice = useCameraDevice(facing);

  if (!hasCam || !hasMic) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Autorisations caméra et microphone requises.
        </Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermissions}>
          <Text style={styles.permissionBtnText}>Autoriser</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {backDevice && (
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={backDevice}
          isActive
          video
          audio
        />
      )}

      <SafeAreaView style={styles.overlay}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.speedRow}>
          {SPEEDS.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.speedPill, speed === s && styles.speedActive]}
              onPress={() => setSpeed(s)}>
              <Text style={[styles.speedText, speed === s && styles.speedActiveText]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.flipBtn}
          onPress={flipCamera}>
          <Text style={styles.flipText}>⟳</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.recordOuter, isRecording && styles.recordOuterActive]}
          onPressIn={startRecording}
          onPressOut={stopRecording}
          activeOpacity={1}>
          <View style={[styles.recordInner, isRecording && styles.recordInnerActive]} />
        </TouchableOpacity>

        <View style={styles.flipBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  overlay: { flex: 1 },
  closeBtn: { padding: spacing.lg },
  closeText: { color: colors.white, fontSize: 20 },
  speedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  speedPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  speedActive: { backgroundColor: colors.white },
  speedText: { color: colors.white, fontSize: typography.sm },
  speedActiveText: { color: colors.background, fontWeight: typography.bold },
  bottom: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  flipBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  flipText: { color: colors.white, fontSize: 28 },
  recordOuter: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordOuterActive: { borderColor: colors.primary },
  recordInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
  },
  recordInnerActive: { width: 40, height: 40, borderRadius: 8 },
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  permissionText: { color: colors.white, textAlign: 'center', marginBottom: spacing.xl },
  permissionBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 4,
  },
  permissionBtnText: { color: colors.white, fontWeight: typography.bold },
});
```

- [ ] **Step 3 : Implémenter PostScreen.tsx**

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors, typography, spacing } from '../../theme';
import { useUpload } from '../../hooks/useUpload';

type RouteParams = {
  Post: { videoUri: string; duration: number };
};

export default function PostScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'Post'>>();
  const { videoUri, duration } = route.params;
  const { upload, progress, isUploading, error } = useUpload();

  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');

  function parseHashtags(raw: string): string[] {
    return raw
      .split(/[\s,]+/)
      .map(t => t.replace(/^#/, '').trim())
      .filter(Boolean);
  }

  async function handlePost() {
    const success = await upload({
      localUri: videoUri,
      description,
      hashtags: parseHashtags(hashtags),
      musicName: '',
      duration,
      thumbnailUrl: '',
    });
    if (success) {
      navigation.navigate('Home');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Nouvelle publication</Text>
          <View style={{ width: 24 }} />
        </View>

        <Video
          source={{ uri: videoUri }}
          style={styles.preview}
          repeat
          muted
          paused={isUploading}
          resizeMode="cover"
        />

        <TextInput
          style={styles.input}
          placeholder="Décris ta vidéo..."
          placeholderTextColor={colors.gray}
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={150}
        />

        <TextInput
          style={styles.input}
          placeholder="#hashtags séparés par des espaces"
          placeholderTextColor={colors.gray}
          value={hashtags}
          onChangeText={setHashtags}
          autoCapitalize="none"
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        {isUploading && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.postBtn, isUploading && styles.postDisabled]}
          onPress={handlePost}
          disabled={isUploading}
          activeOpacity={0.8}>
          {isUploading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.postBtnText}>Publier</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  backText: { color: colors.white, fontSize: 22 },
  title: { color: colors.white, fontWeight: typography.bold, fontSize: typography.lg },
  preview: {
    width: '100%',
    aspectRatio: 9 / 16,
    borderRadius: 8,
    marginBottom: spacing.lg,
    backgroundColor: colors.surfaceLight,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    color: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: typography.base,
    marginBottom: spacing.md,
    minHeight: 50,
  },
  errorText: { color: colors.primary, fontSize: typography.sm, marginBottom: spacing.md },
  progressContainer: {
    height: 4,
    backgroundColor: colors.surfaceLight,
    borderRadius: 2,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  progressBar: { height: 4, backgroundColor: colors.primary },
  progressText: { color: colors.gray, fontSize: typography.xs, marginTop: spacing.xs },
  postBtn: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  postDisabled: { opacity: 0.5 },
  postBtnText: { color: colors.white, fontWeight: typography.bold, fontSize: typography.base },
});
```

- [ ] **Step 4 : Ajouter Post à la navigation**

Modifier `src/navigation/MainNavigator.tsx` — ajouter PostScreen dans un Stack navigator par-dessus les tabs. Remplacer l'export :

```tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/feed/HomeScreen';
import DiscoverScreen from '../screens/discover/DiscoverScreen';
import CameraScreen from '../screens/upload/CameraScreen';
import PostScreen from '../screens/upload/PostScreen';
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

export type MainStackParamList = {
  Tabs: undefined;
  Post: { videoUri: string; duration: number };
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<MainStackParamList>();

function TabNavigator() {
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
        options={{ tabBarIcon: ({ color }) => <Ionicons name="home" size={26} color={color} /> }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{ tabBarIcon: ({ color }) => <Ionicons name="search" size={26} color={color} /> }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{ tabBarIcon: () => <PlusTabIcon /> }}
      />
      <Tab.Screen
        name="Inbox"
        component={InboxScreen}
        options={{ tabBarIcon: ({ color }) => <Ionicons name="chatbubble-outline" size={26} color={color} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={26} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Post" component={PostScreen} />
    </Stack.Navigator>
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

- [ ] **Step 5 : Commit**

```bash
git add src/hooks/useUpload.ts src/screens/upload/ src/navigation/MainNavigator.tsx
git commit -m "feat: add Camera screen, Post screen, and useUpload hook"
```

---

## Task 18 : DiscoverScreen

**Files:**
- Create: `src/components/discover/SearchBar.tsx`
- Create: `src/components/discover/TrendingHashtags.tsx`
- Create: `src/components/discover/VideoGrid.tsx`
- Modify: `src/screens/discover/DiscoverScreen.tsx`

- [ ] **Step 1 : Créer src/components/discover/SearchBar.tsx**

```tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography } from '../../theme';

interface Props {
  value: string;
  onChangeText: (t: string) => void;
  onSubmit: () => void;
}

export default function SearchBar({ value, onChangeText, onSubmit }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={colors.gray} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Rechercher"
        placeholderTextColor={colors.gray}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={18} color={colors.gray} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 22,
    height: 45,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  icon: { marginRight: spacing.sm },
  input: { flex: 1, color: colors.white, fontSize: typography.base },
});
```

- [ ] **Step 2 : Créer src/components/discover/TrendingHashtags.tsx**

```tsx
import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';

const TRENDING = ['fyp', 'viral', 'dance', 'funny', 'music', 'food', 'travel', 'art', 'sport', 'gaming'];

interface Props {
  onSelect: (tag: string) => void;
}

export default function TrendingHashtags({ onSelect }: Props) {
  return (
    <FlatList
      data={TRENDING}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      keyExtractor={item => item}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.pill}
          onPress={() => onSelect(item)}
          activeOpacity={0.7}>
          <Text style={styles.text}>#{item}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.md },
  pill: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    height: 36,
    justifyContent: 'center',
  },
  text: { color: colors.white, fontSize: typography.sm },
});
```

- [ ] **Step 3 : Créer src/components/discover/VideoGrid.tsx**

```tsx
import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Video } from '../../types';
import { formatNumber } from '../../utils/formatNumber';
import { colors, typography } from '../../theme';

const { width } = Dimensions.get('window');
const CELL = (width - 2) / 2;

interface Props {
  videos: Video[];
  onPress: (video: Video) => void;
}

export default function VideoGrid({ videos, onPress }: Props) {
  return (
    <View style={styles.grid}>
      {videos.map(v => (
        <TouchableOpacity
          key={v.videoId}
          style={styles.cell}
          onPress={() => onPress(v)}
          activeOpacity={0.8}>
          <FastImage
            source={{ uri: v.thumbnailUrl || undefined }}
            style={styles.thumb}
          />
          <View style={styles.overlay}>
            <Text style={styles.views}>{formatNumber(v.viewsCount)}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  cell: { width: CELL, height: CELL * (16 / 9), backgroundColor: colors.surfaceLight },
  thumb: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  views: { color: colors.white, fontSize: typography.xs, fontWeight: typography.bold },
});
```

- [ ] **Step 4 : Implémenter DiscoverScreen.tsx**

```tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { colors, typography, spacing } from '../../theme';
import SearchBar from '../../components/discover/SearchBar';
import TrendingHashtags from '../../components/discover/TrendingHashtags';
import VideoGrid from '../../components/discover/VideoGrid';
import { searchVideos } from '../../services/firebase/videos.service';
import { Video } from '../../types';

export default function DiscoverScreen() {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setVideos([]); return; }
    setIsLoading(true);
    try {
      const results = await searchVideos(q.trim());
      setVideos(results);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Découvrir</Text>
      <SearchBar value={query} onChangeText={setQuery} onSubmit={() => doSearch(query)} />

      {!query && (
        <>
          <Text style={styles.sectionTitle}>Tendances</Text>
          <TrendingHashtags onSelect={tag => { setQuery(tag); doSearch(tag); }} />
        </>
      )}

      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : videos.length > 0 ? (
        <VideoGrid videos={videos} onPress={() => {}} />
      ) : query && !isLoading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucun résultat pour "{query}"</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: {
    color: colors.white,
    fontWeight: typography.bold,
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    color: colors.white,
    fontWeight: typography.bold,
    fontSize: typography.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  loader: { marginTop: spacing.xxxl },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: colors.gray },
});
```

- [ ] **Step 5 : Commit**

```bash
git add src/components/discover/ src/screens/discover/
git commit -m "feat: implement Discover screen with search and trending hashtags"
```

---

## Task 19 : ProfileScreen et composants

**Files:**
- Create: `src/components/profile/ProfileHeader.tsx`
- Create: `src/components/profile/ProfileStats.tsx`
- Create: `src/components/profile/ProfileVideoGrid.tsx`
- Modify: `src/screens/profile/ProfileScreen.tsx`
- Modify: `src/screens/profile/EditProfileScreen.tsx`

- [ ] **Step 1 : Créer src/components/profile/ProfileStats.tsx**

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';
import { formatNumber } from '../../utils/formatNumber';

interface Props {
  following: number;
  followers: number;
  likes: number;
}

export default function ProfileStats({ following, followers, likes }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.stat}>
        <Text style={styles.count}>{formatNumber(following)}</Text>
        <Text style={styles.label}>Abonnements</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.stat}>
        <Text style={styles.count}>{formatNumber(followers)}</Text>
        <Text style={styles.label}>Abonnés</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.stat}>
        <Text style={styles.count}>{formatNumber(likes)}</Text>
        <Text style={styles.label}>J'aime</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: spacing.lg },
  stat: { alignItems: 'center', paddingHorizontal: spacing.xl },
  count: { color: colors.white, fontWeight: typography.bold, fontSize: typography.xl },
  label: { color: colors.gray, fontSize: typography.xs, marginTop: 2 },
  divider: { width: 1, height: 30, backgroundColor: colors.grayLight },
});
```

- [ ] **Step 2 : Créer src/components/profile/ProfileHeader.tsx**

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, typography, spacing } from '../../theme';
import { User } from '../../types';

interface Props {
  user: User;
  isOwnProfile: boolean;
  isFollowing: boolean;
  onFollow: () => void;
  onEdit: () => void;
  onBack?: () => void;
}

export default function ProfileHeader({
  user,
  isOwnProfile,
  isFollowing,
  onFollow,
  onEdit,
  onBack,
}: Props) {
  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity style={styles.back} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
      )}

      <Text style={styles.username}>@{user.username}</Text>

      <FastImage
        source={{ uri: user.avatar || undefined }}
        style={styles.avatar}
      />

      {user.isVerified && (
        <Ionicons
          name="checkmark-circle"
          size={20}
          color={colors.verified}
          style={styles.badge}
        />
      )}

      {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}

      <View style={styles.actions}>
        {isOwnProfile ? (
          <TouchableOpacity style={styles.outlineBtn} onPress={onEdit}>
            <Text style={styles.outlineBtnText}>Modifier le profil</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.followBtn, isFollowing && styles.outlineBtn]}
              onPress={onFollow}
              activeOpacity={0.8}>
              <Text style={[styles.followBtnText, isFollowing && styles.outlineBtnText]}>
                {isFollowing ? 'Abonné' : "S'abonner"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.outlineBtn}>
              <Text style={styles.outlineBtnText}>Message</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: spacing.xl, paddingBottom: spacing.md },
  back: { position: 'absolute', left: spacing.lg, top: spacing.xl },
  username: {
    color: colors.white,
    fontWeight: typography.bold,
    fontSize: typography.lg,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.surfaceLight,
  },
  badge: { position: 'absolute', bottom: 100, right: '38%' },
  bio: {
    color: colors.white,
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  followBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    height: 36,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
  },
  followBtnText: { color: colors.white, fontWeight: typography.bold, fontSize: typography.sm },
  outlineBtn: {
    borderWidth: 1,
    borderColor: colors.grayLight,
    paddingHorizontal: spacing.lg,
    height: 36,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
  },
  outlineBtnText: { color: colors.white, fontSize: typography.sm },
});
```

- [ ] **Step 3 : Créer src/components/profile/ProfileVideoGrid.tsx**

```tsx
import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Video } from '../../types';
import { formatNumber } from '../../utils/formatNumber';
import { colors, typography } from '../../theme';

const { width } = Dimensions.get('window');
const CELL = width / 3;

interface Props {
  videos: Video[];
  onPress: (video: Video) => void;
}

export default function ProfileVideoGrid({ videos, onPress }: Props) {
  return (
    <View style={styles.grid}>
      {videos.map(v => (
        <TouchableOpacity
          key={v.videoId}
          style={styles.cell}
          onPress={() => onPress(v)}
          activeOpacity={0.8}>
          <FastImage
            source={{ uri: v.thumbnailUrl || undefined }}
            style={styles.thumb}
          />
          <View style={styles.overlay}>
            <Ionicons name="play" size={12} color={colors.white} />
            <Text style={styles.count}>{formatNumber(v.viewsCount)}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: CELL,
    height: CELL * (4 / 3),
    backgroundColor: colors.surfaceLight,
  },
  thumb: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  count: { color: colors.white, fontSize: typography.xs, fontWeight: typography.bold },
});
```

- [ ] **Step 4 : Implémenter ProfileScreen.tsx**

```tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing } from '../../theme';
import { useAppSelector } from '../../store/hooks';
import { useFollow } from '../../hooks/useFollow';
import { getUserById, isFollowing } from '../../services/firebase/users.service';
import { getVideosByUser } from '../../services/firebase/videos.service';
import { User, Video } from '../../types';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileStats from '../../components/profile/ProfileStats';
import ProfileVideoGrid from '../../components/profile/ProfileVideoGrid';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const currentUser = useAppSelector(s => s.auth.user);
  const { follow } = useFollow();

  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    setIsLoading(true);
    getVideosByUser(currentUser.uid)
      .then(setVideos)
      .finally(() => setIsLoading(false));
  }, [currentUser]);

  const handleFollow = useCallback(async () => {
    if (!currentUser) return;
    await follow(currentUser.uid, following);
    setFollowing(f => !f);
  }, [follow, currentUser, following]);

  if (!currentUser) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader
          user={currentUser}
          isOwnProfile
          isFollowing={false}
          onFollow={handleFollow}
          onEdit={() => navigation.navigate('EditProfile')}
        />

        <ProfileStats
          following={currentUser.followingCount}
          followers={currentUser.followersCount}
          likes={0}
        />

        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : videos.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune vidéo publiée</Text>
          </View>
        ) : (
          <ProfileVideoGrid videos={videos} onPress={() => {}} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loader: { marginTop: spacing.xxxl },
  empty: { padding: spacing.xxxl, alignItems: 'center' },
  emptyText: { color: colors.gray },
});
```

- [ ] **Step 5 : Implémenter EditProfileScreen.tsx**

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing } from '../../theme';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setUser } from '../../store/slices/authSlice';
import { updateUserProfile } from '../../services/firebase/users.service';

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateUserProfile(user.uid, { displayName, bio });
      dispatch(setUser({ ...user, displayName, bio }));
      navigation.goBack();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>Annuler</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Modifier le profil</Text>
        <TouchableOpacity onPress={handleSave} disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : (
            <Text style={styles.save}>Sauvegarder</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nom d'affichage</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholderTextColor={colors.gray}
        />
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={bio}
          onChangeText={setBio}
          multiline
          maxLength={150}
          placeholderTextColor={colors.gray}
          placeholder="Parle de toi..."
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.grayLight,
  },
  cancel: { color: colors.white, fontSize: typography.base },
  title: { color: colors.white, fontWeight: typography.bold, fontSize: typography.lg },
  save: { color: colors.primary, fontWeight: typography.bold, fontSize: typography.base },
  form: { padding: spacing.lg },
  label: { color: colors.gray, fontSize: typography.sm, marginBottom: spacing.xs, marginTop: spacing.lg },
  input: {
    backgroundColor: colors.surfaceLight,
    color: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: typography.base,
  },
  bioInput: { height: 80, textAlignVertical: 'top' },
});
```

- [ ] **Step 6 : Ajouter EditProfile à la navigation**

Dans `src/navigation/AppNavigator.tsx`, modifier pour inclure EditProfileScreen :

```tsx
// Ajouter dans MainStackParamList de MainNavigator.tsx
EditProfile: undefined;

// Ajouter dans le Stack de MainNavigator
<Stack.Screen name="EditProfile" component={EditProfileScreen} />
```

Importer `EditProfileScreen` dans `MainNavigator.tsx` :
```tsx
import EditProfileScreen from '../screens/profile/EditProfileScreen';
```

- [ ] **Step 7 : Commit**

```bash
git add src/components/profile/ src/screens/profile/ src/navigation/
git commit -m "feat: implement Profile screens and components"
```

---

## Task 20 : InboxScreen

**Files:**
- Modify: `src/screens/inbox/InboxScreen.tsx`

- [ ] **Step 1 : Implémenter InboxScreen.tsx**

```tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { colors, typography, spacing } from '../../theme';
import { useAppSelector } from '../../store/hooks';
import {
  subscribeToNotifications,
  markNotificationRead,
} from '../../services/notifications.service';
import { Notification } from '../../types';

const FILTER_TABS = ['Tout', 'J\'aime', 'Commentaires', 'Mentions', 'Abonnés'];

export default function InboxScreen() {
  const uid = useAppSelector(s => s.auth.user?.uid);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!uid) return;
    const unsubscribe = subscribeToNotifications(uid, setNotifications);
    return unsubscribe;
  }, [uid]);

  async function handleRead(notifId: string) {
    if (!uid) return;
    await markNotificationRead(uid, notifId);
  }

  const typeMap: Record<string, Notification['type']> = {
    "J'aime": 'like',
    'Commentaires': 'comment',
    'Mentions': 'mention',
    'Abonnés': 'follow',
  };

  const filtered =
    activeTab === 0
      ? notifications
      : notifications.filter(n => n.type === typeMap[FILTER_TABS[activeTab]]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Activité</Text>

      <FlatList
        data={FILTER_TABS}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
        keyExtractor={item => item}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => setActiveTab(index)}
            style={[styles.tab, activeTab === index && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={item => item.fromUid + item.createdAt?.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notifRow, !item.isRead && styles.notifUnread]}
            onPress={() => handleRead(item.fromUid)}>
            <View style={styles.avatar} />
            <View style={styles.notifContent}>
              <Text style={styles.notifText}>{item.text}</Text>
            </View>
            {item.videoId && (
              <View style={styles.thumbPlaceholder} />
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune notification</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: {
    color: colors.white,
    fontWeight: typography.bold,
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  tabs: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.md },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: colors.white },
  tabText: { color: colors.gray, fontSize: typography.sm },
  tabTextActive: { color: colors.white, fontWeight: typography.bold },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  notifUnread: { backgroundColor: 'rgba(255,255,255,0.05)' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceLight,
  },
  notifContent: { flex: 1 },
  notifText: { color: colors.white, fontSize: typography.sm },
  thumbPlaceholder: {
    width: 42,
    height: 54,
    borderRadius: 4,
    backgroundColor: colors.surfaceLight,
  },
  empty: { padding: spacing.xxxl, alignItems: 'center' },
  emptyText: { color: colors.gray },
});
```

- [ ] **Step 2 : Commit**

```bash
git add src/screens/inbox/
git commit -m "feat: implement Inbox screen with notification filters"
```

---

## Task 20b : Assets animations + TabBarIcon

**Files:**
- Create: `src/assets/animations/heart.json` (fichier Lottie)
- Create: `src/components/common/TabBarIcon.tsx`

- [ ] **Step 1 : Télécharger le fichier Lottie heart.json**

Télécharger un fichier Lottie cœur rouge gratuit depuis [lottiefiles.com](https://lottiefiles.com/search?q=heart&category=animations) ou utiliser ce JSON minimal fonctionnel :

Créer `src/assets/animations/heart.json` avec le contenu disponible sur LottieFiles (rechercher "heart like" et télécharger le JSON). Si hors ligne, utiliser ce stub minimal qui affiche juste un cœur rouge :

```json
{
  "v": "5.7.4",
  "fr": 30,
  "ip": 0,
  "op": 30,
  "w": 150,
  "h": 150,
  "nm": "Heart",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Heart",
      "sr": 1,
      "ks": {
        "o": { "a": 1, "k": [{ "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 0, "s": [0] }, { "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 5, "s": [100] }, { "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 20, "s": [100] }, { "t": 30, "s": [0] }] },
        "r": { "a": 0, "k": 0 },
        "p": { "a": 0, "k": [75, 75, 0] },
        "a": { "a": 0, "k": [0, 0, 0] },
        "s": { "a": 1, "k": [{ "i": { "x": [0.833, 0.833, 0.833], "y": [0.833, 0.833, 0.833] }, "o": { "x": [0.167, 0.167, 0.167], "y": [0.167, 0.167, 0.167] }, "t": 0, "s": [0, 0, 100] }, { "i": { "x": [0.833, 0.833, 0.833], "y": [0.833, 0.833, 0.833] }, "o": { "x": [0.167, 0.167, 0.167], "y": [0.167, 0.167, 0.167] }, "t": 8, "s": [130, 130, 100] }, { "t": 15, "s": [100, 100, 100] }] }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            { "ty": "sr", "sy": 1, "d": 1, "pt": { "a": 0, "k": 5 }, "p": { "a": 0, "k": [0, 0] }, "r": { "a": 0, "k": 0 }, "ir": { "a": 0, "k": 30 }, "is": { "a": 0, "k": 0 }, "or": { "a": 0, "k": 50 }, "os": { "a": 0, "k": 0 }, "ix": 1, "nm": "Polystar Path 1" },
            { "ty": "fl", "c": { "a": 0, "k": [0.996, 0.173, 0.333, 1] }, "o": { "a": 0, "k": 100 }, "r": 1, "bm": 0, "nm": "Fill 1" },
            { "ty": "tr", "p": { "a": 0, "k": [0, 0] }, "a": { "a": 0, "k": [0, 0] }, "s": { "a": 0, "k": [100, 100] }, "r": { "a": 0, "k": 0 }, "o": { "a": 0, "k": 100 }, "sk": { "a": 0, "k": 0 }, "sa": { "a": 0, "k": 0 }, "nm": "Transform" }
          ],
          "nm": "Heart Group"
        }
      ],
      "ip": 0,
      "op": 30,
      "st": 0,
      "bm": 0
    }
  ]
}
```

- [ ] **Step 2 : Créer src/components/common/TabBarIcon.tsx**

```tsx
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme';

interface Props {
  name: string;
  focused: boolean;
  size?: number;
}

export default function TabBarIcon({ name, focused, size = 26 }: Props) {
  return (
    <Ionicons
      name={focused ? name : `${name}-outline`}
      size={size}
      color={focused ? colors.white : colors.gray}
    />
  );
}
```

- [ ] **Step 3 : Commit**

```bash
git add src/assets/animations/ src/components/common/TabBarIcon.tsx
git commit -m "feat: add Lottie heart animation and TabBarIcon component"
```

---

## Task 21 : Composants communs

**Files:**
- Create: `src/components/common/Avatar.tsx`
- Create: `src/components/common/Button.tsx`
- Create: `src/components/common/Loader.tsx`
- Create: `src/components/common/SkeletonLoader.tsx`

- [ ] **Step 1 : Créer src/components/common/Avatar.tsx**

```tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { colors } from '../../theme';

interface Props {
  uri?: string | null;
  size?: number;
}

export default function Avatar({ uri, size = 40 }: Props) {
  const radius = size / 2;
  return (
    <FastImage
      source={{ uri: uri ?? undefined }}
      style={[
        styles.base,
        { width: size, height: size, borderRadius: radius },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.surfaceLight },
});
```

- [ ] **Step 2 : Créer src/components/common/Button.tsx**

```tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import { colors, typography } from '../../theme';

interface Props extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'outline';
  loading?: boolean;
}

export default function Button({ title, variant = 'primary', loading, style, ...rest }: Props) {
  return (
    <TouchableOpacity
      style={[styles.base, variant === 'outline' ? styles.outline : styles.primary, style]}
      activeOpacity={0.8}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={colors.white} size="small" />
      ) : (
        <Text style={[styles.text, variant === 'outline' && styles.outlineText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  primary: { backgroundColor: colors.primary },
  outline: { borderWidth: 1, borderColor: colors.grayLight },
  text: { color: colors.white, fontWeight: typography.bold, fontSize: typography.base },
  outlineText: { color: colors.white },
});
```

- [ ] **Step 3 : Créer src/components/common/Loader.tsx**

```tsx
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../theme';

export default function Loader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
});
```

- [ ] **Step 4 : Créer src/components/common/SkeletonLoader.tsx**

```tsx
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../../theme';

interface Props {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export default function SkeletonLoader({ width, height, borderRadius = 4, style }: Props) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: colors.surfaceLight },
        { opacity },
        style,
      ]}
    />
  );
}
```

- [ ] **Step 5 : Créer un placeholder disc image**

Créer `src/assets/icons/disc-placeholder.png` — copier n'importe quelle image PNG 46×46 dans ce dossier. Peut être une image noire unie si aucune image n'est disponible. Ce fichier est requis par MusicDisc.tsx.

- [ ] **Step 6 : Commit**

```bash
git add src/components/common/ src/assets/
git commit -m "feat: add common components (Avatar, Button, Loader, SkeletonLoader)"
```

---

## Task 22 : Script de Seed

**Files:**
- Create: `scripts/seedFirestore.ts`

- [ ] **Step 1 : Créer scripts/seedFirestore.ts**

```ts
/**
 * Script de seed pour Firestore.
 * Exécuter avec: npx ts-node scripts/seedFirestore.ts
 * Nécessite d'avoir configuré les variables d'environnement Firebase Admin.
 */

import * as admin from 'firebase-admin';

// Initialiser avec les credentials du service account
// Télécharger le fichier depuis Firebase Console > Paramètres > Comptes de service
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
});

const db = admin.firestore();
const auth = admin.auth();

const SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
];

const SAMPLE_THUMBNAILS = [
  'https://picsum.photos/seed/v1/400/700',
  'https://picsum.photos/seed/v2/400/700',
  'https://picsum.photos/seed/v3/400/700',
  'https://picsum.photos/seed/v4/400/700',
  'https://picsum.photos/seed/v5/400/700',
];

const DEMO_USERS = [
  { email: 'alice@demo.com', password: 'demo123', username: 'alice_demo', displayName: 'Alice Demo' },
  { email: 'bob@demo.com', password: 'demo123', username: 'bob_demo', displayName: 'Bob Demo' },
  { email: 'charlie@demo.com', password: 'demo123', username: 'charlie_demo', displayName: 'Charlie' },
  { email: 'diana@demo.com', password: 'demo123', username: 'diana_demo', displayName: 'Diana' },
  { email: 'eve@demo.com', password: 'demo123', username: 'eve_demo', displayName: 'Eve' },
];

async function seed() {
  console.log('🌱 Début du seed...');

  const userIds: string[] = [];

  // Créer les utilisateurs
  for (const u of DEMO_USERS) {
    try {
      let firebaseUser;
      try {
        firebaseUser = await auth.createUser({ email: u.email, password: u.password });
      } catch {
        const existing = await auth.getUserByEmail(u.email);
        firebaseUser = existing;
      }
      const uid = firebaseUser.uid;
      userIds.push(uid);

      await db.collection('users').doc(uid).set({
        uid,
        username: u.username,
        displayName: u.displayName,
        bio: `Compte démo — ${u.displayName}`,
        avatar: `https://picsum.photos/seed/${u.username}/200/200`,
        followersCount: 0,
        followingCount: 0,
        videosCount: 0,
        isPrivate: false,
        isVerified: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✅ User créé : ${u.username}`);
    } catch (e) {
      console.error(`❌ Erreur user ${u.username}:`, e);
    }
  }

  // Créer les vidéos
  const videoIds: string[] = [];
  for (let i = 0; i < 20; i++) {
    const authorId = userIds[i % userIds.length];
    const ref = db.collection('videos').doc();
    const vid = {
      videoId: ref.id,
      authorId,
      videoUrl: SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length],
      thumbnailUrl: SAMPLE_THUMBNAILS[i % SAMPLE_THUMBNAILS.length],
      description: `Vidéo démo numéro ${i + 1} #demo #tiktok`,
      hashtags: ['demo', 'tiktok', `video${i + 1}`],
      musicName: 'Son original',
      likesCount: Math.floor(Math.random() * 5000),
      commentsCount: Math.floor(Math.random() * 100),
      sharesCount: Math.floor(Math.random() * 200),
      viewsCount: Math.floor(Math.random() * 50000),
      duration: 15 + Math.floor(Math.random() * 45),
      isPublic: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await ref.set(vid);
    videoIds.push(ref.id);

    // Incrémenter videosCount de l'auteur
    await db.collection('users').doc(authorId).update({
      videosCount: admin.firestore.FieldValue.increment(1),
    });

    // Ajouter des commentaires
    for (let c = 0; c < 3; c++) {
      const commenterUid = userIds[(c + i) % userIds.length];
      const commentRef = db.collection('videos').doc(ref.id).collection('comments').doc();
      await commentRef.set({
        commentId: commentRef.id,
        authorId: commenterUid,
        text: `Super vidéo ! 🔥 (commentaire ${c + 1})`,
        likesCount: Math.floor(Math.random() * 50),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Ajouter des likes
    for (let l = 0; l < 2; l++) {
      const likerUid = userIds[(l + i + 1) % userIds.length];
      await db.collection('videos').doc(ref.id).collection('likes').doc(likerUid).set({
        uid: likerUid,
        likedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    console.log(`✅ Video créée : ${ref.id}`);
  }

  // Créer des relations de follow
  for (let i = 0; i < userIds.length; i++) {
    const follower = userIds[i];
    const following = userIds[(i + 1) % userIds.length];
    await db.collection('users').doc(follower).collection('following').doc(following).set({
      followedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    await db.collection('users').doc(follower).update({
      followingCount: admin.firestore.FieldValue.increment(1),
    });
    await db.collection('users').doc(following).update({
      followersCount: admin.firestore.FieldValue.increment(1),
    });
  }

  console.log('🎉 Seed terminé avec succès !');
  process.exit(0);
}

seed().catch(e => {
  console.error('❌ Seed échoué:', e);
  process.exit(1);
});
```

- [ ] **Step 2 : Installer les dépendances du script (dans un terminal séparé, hors de l'app RN)**

```bash
npm install --save-dev firebase-admin ts-node @types/node
```

- [ ] **Step 3 : Commit**

```bash
git add scripts/ package.json
git commit -m "feat: add Firestore seed script with 5 users and 20 videos"
```

---

## Task 23 : README mis à jour

**Files:**
- Modify: `README.md`

- [ ] **Step 1 : Remplacer README.md**

```markdown
# TikTok Clone — React Native CLI

Clone TikTok production-quality avec Firebase backend.

## Stack
- React Native CLI 0.85.3 (New Architecture)
- TypeScript
- Firebase (Auth + Firestore + Storage + Messaging)
- Redux Toolkit + RTK Query
- React Navigation 6

## Prérequis
- Node.js >= 22.11.0
- Android Studio + SDK
- JDK 17
- Un projet Firebase configuré

## Configuration Firebase

1. Aller sur [console.firebase.google.com](https://console.firebase.google.com)
2. Créer un projet (ou utiliser un existant)
3. Activer : Authentication (Email/Password), Firestore, Storage, Cloud Messaging
4. Télécharger `google-services.json` → placer dans `android/app/`
5. Copier les règles de sécurité depuis `docs/superpowers/specs/2026-05-31-tiktok-clone-design.md` dans la console Firestore

## Installation

```bash
npm install
npm run android
```

## Seed (données de démo)

1. Dans Firebase Console > Paramètres > Comptes de service > Générer une nouvelle clé privée
2. Sauvegarder sous `firebase-service-account.json` à la racine
3. Modifier `storageBucket` dans `scripts/seedFirestore.ts`
4. Lancer : `npx ts-node scripts/seedFirestore.ts`

## Structure
Voir `docs/superpowers/specs/2026-05-31-tiktok-clone-design.md`
```

- [ ] **Step 2 : Commit final**

```bash
git add README.md
git commit -m "docs: update README with setup instructions"
```

---

**Phase 3 et projet complet terminés.**

Récapitulatif de ce qui a été construit :
- Auth flow complet (Welcome, Login, Register)
- Feed vidéo plein écran avec autoplay, double-tap like, animations
- Système de commentaires en temps réel
- Caméra + upload avec compression et progression
- Discover avec recherche et trending hashtags
- Profile (own + edit)
- Inbox avec filtres de notifications
- Composants communs réutilisables
- Script de seed avec 5 users et 20 vidéos
