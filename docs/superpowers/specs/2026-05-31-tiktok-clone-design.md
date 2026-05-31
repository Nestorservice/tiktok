# TikTok Clone — Design Spec
**Date:** 2026-05-31  
**Plateforme cible:** Android uniquement (Windows dev environment)  
**Stack:** React Native CLI 0.85.3 + React 19.2.3 + Firebase + TypeScript

---

## 1. Contexte & Objectif

Construire un clone TikTok production-quality en React Native CLI avec Firebase comme backend. L'app doit être visuellement identique à TikTok, entièrement fonctionnelle, avec des animations fluides et une vraie persistance des données. Pas de paiements, pas de publicités.

---

## 2. Décisions Techniques

### Langage
- **TypeScript strict** — tous les fichiers en `.tsx` / `.ts`
- Interfaces TypeScript pour chaque composant, service, slice Redux
- Pas de PropTypes (TypeScript remplace)
- `tsconfig.json` existant conservé

### Plateforme
- **Android uniquement** pour cette phase
- `google-services.json` dans `android/app/`
- Pas de configuration iOS (pas de Mac disponible)

### Versions des librairies (compatibles New Architecture RN 0.85.3)

| Librairie | Version | Rôle |
|---|---|---|
| `@react-native-firebase/app` | `^21.x` | Core Firebase |
| `@react-native-firebase/auth` | `^21.x` | Authentification |
| `@react-native-firebase/firestore` | `^21.x` | Base de données |
| `@react-native-firebase/storage` | `^21.x` | Stockage vidéos |
| `@react-native-firebase/messaging` | `^21.x` | Notifications push |
| `@react-navigation/native` | `^6.x` | Navigation core |
| `@react-navigation/bottom-tabs` | `^6.x` | Onglets du bas |
| `@react-navigation/stack` | `^6.x` | Stack screens |
| `@react-navigation/material-top-tabs` | `^6.x` | Tabs "Following/For You" |
| `@reduxjs/toolkit` | `^2.x` | State management |
| `react-redux` | `^9.x` | Bindings Redux |
| `react-native-video` | `^6.x` | Lecture vidéo (New Arch JSI) |
| `react-native-vision-camera` | `^4.x` | Enregistrement vidéo |
| `react-native-reanimated` | `^3.x` | Animations |
| `react-native-gesture-handler` | `^2.x` | Gestes |
| `@gorhom/bottom-sheet` | `^5.x` | Feuilles de commentaires |
| `lottie-react-native` | `^7.x` | Animation cœur like |
| `react-native-fast-image` | `^9.x` | Images optimisées |
| `react-native-vector-icons` | `^10.x` | Icônes Ionicons + Material |
| `react-native-linear-gradient` | `^2.x` | Overlays dégradés |
| `react-native-permissions` | `^4.x` | Caméra, micro, storage |
| `react-native-share` | `^10.x` | Partage natif |
| `react-native-compressor` | `^1.x` | Compression vidéo avant upload |
| `@react-native-async-storage/async-storage` | `^2.x` | Persistance locale |
| `react-native-safe-area-context` | `^5.x` | Déjà installé |
| `react-native-screens` | `^4.x` | Optimisation navigation |

---

## 3. Structure du Projet

```
src/
├── assets/
│   ├── animations/          # Fichiers Lottie JSON (cœur, confetti)
│   └── icons/
├── components/
│   ├── common/
│   │   ├── Avatar.tsx
│   │   ├── Button.tsx
│   │   ├── Loader.tsx
│   │   ├── SkeletonLoader.tsx
│   │   └── TabBarIcon.tsx
│   ├── feed/
│   │   ├── VideoItem.tsx
│   │   ├── VideoActions.tsx
│   │   ├── VideoInfo.tsx
│   │   ├── MusicDisc.tsx
│   │   ├── DoubleTapLike.tsx
│   │   └── FollowButton.tsx
│   ├── comments/
│   │   ├── CommentSheet.tsx
│   │   ├── CommentItem.tsx
│   │   └── CommentInput.tsx
│   ├── discover/
│   │   ├── SearchBar.tsx
│   │   ├── TrendingHashtags.tsx
│   │   └── VideoGrid.tsx
│   └── profile/
│       ├── ProfileHeader.tsx
│       ├── ProfileStats.tsx
│       └── ProfileVideoGrid.tsx
├── screens/
│   ├── auth/
│   │   ├── WelcomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   └── RegisterScreen.tsx
│   ├── feed/
│   │   └── HomeScreen.tsx
│   ├── discover/
│   │   └── DiscoverScreen.tsx
│   ├── upload/
│   │   ├── CameraScreen.tsx
│   │   └── PostScreen.tsx
│   ├── inbox/
│   │   └── InboxScreen.tsx
│   └── profile/
│       ├── ProfileScreen.tsx
│       └── EditProfileScreen.tsx
├── navigation/
│   ├── AppNavigator.tsx
│   ├── AuthNavigator.tsx
│   ├── MainNavigator.tsx
│   └── tabBarConfig.tsx
├── store/
│   ├── index.ts
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── feedSlice.ts
│   │   ├── playerSlice.ts
│   │   └── uiSlice.ts
│   └── api/
│       ├── videosApi.ts
│       └── usersApi.ts
├── services/
│   ├── firebase/
│   │   ├── auth.service.ts
│   │   ├── videos.service.ts
│   │   ├── users.service.ts
│   │   ├── comments.service.ts
│   │   ├── likes.service.ts
│   │   └── storage.service.ts
│   └── notifications.service.ts
├── hooks/
│   ├── useVideoPlayer.ts
│   ├── useDoubleTap.ts
│   ├── useLike.ts
│   ├── useFollow.ts
│   ├── useUpload.ts
│   └── useAuth.ts
├── utils/
│   ├── formatNumber.ts
│   ├── formatTime.ts
│   ├── validators.ts
│   └── constants.ts
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── index.ts
└── config/
    └── firebase.ts
```

---

## 4. Schéma Firebase

### Collection `users/{uid}`
```ts
{
  uid: string;
  username: string;           // unique, @handle
  displayName: string;
  bio: string;
  avatar: string;             // Storage URL
  followersCount: number;     // dénormalisé
  followingCount: number;     // dénormalisé
  videosCount: number;        // dénormalisé
  isPrivate: boolean;
  isVerified: boolean;
  createdAt: Timestamp;
}
```

### Sous-collection `users/{uid}/following/{targetUid}`
```ts
{ followedAt: Timestamp }
```

### Collection `videos/{videoId}`
```ts
{
  videoId: string;
  authorId: string;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  hashtags: string[];
  musicName: string;
  likesCount: number;         // dénormalisé — jamais compté depuis sous-collection
  commentsCount: number;      // dénormalisé
  sharesCount: number;
  viewsCount: number;
  duration: number;
  isPublic: boolean;
  createdAt: Timestamp;
}
```

### Sous-collection `videos/{videoId}/likes/{uid}`
```ts
{ uid: string; likedAt: Timestamp }
// Doc ID = uid → lookup O(1), double-like impossible
```

### Sous-collection `videos/{videoId}/comments/{commentId}`
```ts
{
  commentId: string;
  authorId: string;
  text: string;
  likesCount: number;
  createdAt: Timestamp;
}
```

### Collection `notifications/{uid}/items/{notifId}`
```ts
{
  type: 'like' | 'comment' | 'follow' | 'mention';
  fromUid: string;
  videoId: string | null;
  text: string;
  isRead: boolean;
  createdAt: Timestamp;
}
```

---

## 5. Règles de Sécurité Firestore

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{uid} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid == uid;
      allow update: if request.auth.uid == uid;

      match /following/{targetUid} {
        allow read: if request.auth != null;
        allow write: if request.auth.uid == uid;
      }
    }

    match /videos/{videoId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
        && request.resource.data.authorId == request.auth.uid;
      allow update: if request.auth.uid == resource.data.authorId;
      allow delete: if request.auth.uid == resource.data.authorId;

      match /likes/{uid} {
        allow read: if request.auth != null;
        allow write: if request.auth.uid == uid;
      }

      match /comments/{commentId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow delete: if request.auth.uid == resource.data.authorId;
      }
    }

    match /notifications/{uid}/items/{notifId} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

---

## 6. Design System

### colors.ts
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
  gradientBottom: ['transparent', 'rgba(0,0,0,0.8)'],
  verified: '#20D5EC',
};
```

### typography.ts
```ts
export const typography = {
  xs: 10, sm: 12, md: 14, base: 15, lg: 17, xl: 20, xxl: 24,
  bold: '700', semibold: '600', medium: '500', regular: '400',
};
```

### spacing.ts
```ts
export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32,
};
```

---

## 7. Logique Métier Principale

### Autoplay Vidéo (`useVideoPlayer.ts`)
- `FlatList` avec `pagingEnabled` + `onViewableItemsChanged` (seuil 80%)
- `currentIndex` stocké dans `playerSlice` Redux
- `paused={index !== currentIndex}` passé à chaque `VideoItem`
- `AppState` listener → pause en background
- `useFocusEffect` → pause quand l'écran perd le focus
- `getItemLayout` retourne `Dimensions.get('window').height` → scroll O(1)

### Système de Like (`useLike.ts`)
- **Optimistic update** : mise à jour locale immédiate, synchronisation Firebase ensuite
- Transaction Firestore : toggle like + mise à jour `likesCount` de façon atomique
- Doc ID du like = `uid` → impossible de liker deux fois côté DB
- Double tap → animation Lottie cœur + appel service like

### Double Tap (`useDoubleTap.ts`)
- Détection de deux taps en moins de 300ms via `useRef` timer
- Single tap → pause/play
- Double tap → like + animation cœur

### Pagination du Feed (`feedSlice.ts`)
- Chargement initial : 10 vidéos
- Chargement anticipé : à l'index 7/10, fetch les 10 suivantes
- Cursor pagination Firestore : `startAfter(lastDoc)`
- Merge sans doublons dans le tableau existant

### Upload (`useUpload.ts`)
- Compression vidéo avant upload via `react-native-compressor`
- Progression 0→100% affichée
- Path Storage : `videos/{uid}/{timestamp}.mp4`
- Écriture Firestore **uniquement après** succès Storage
- Mise à jour atomique de `videosCount`

### Follow (`useFollow.ts`)
- Batch write : ajout doc following + incrémentation des deux compteurs atomiquement
- UI optimiste : mise à jour du bouton immédiatement
- Vérification du statut follow au montage du profil

### Auth (`useAuth.ts`)
- Listener `onAuthStateChanged` dans `AppNavigator`
- User existant → `MainNavigator`, sinon → `AuthNavigator`
- Token persisté via AsyncStorage
- Logout → clear Redux store + AsyncStorage

---

## 8. Animations

| Animation | Détail technique |
|---|---|
| **Like cœur** | Lottie 150px à la position du tap, fade in 200ms → reste 600ms → fade out 300ms. Icône sidebar scale 1→1.4→1 spring Reanimated |
| **Disque musical** | `Animated.loop` + `Animated.timing` 8s linéaire, pausé (non resetté) sur pause vidéo |
| **Marquee caption** | `Animated.sequence` + `Animated.loop` si texte > conteneur, translate 0 → -textWidth en 4s |
| **Bouton Follow** | `scale(0.95)` onPress via Reanimated spring |
| **Tab Plus** | Dégradé `#FE2C55` → `#25F4EE` diagonal, icône `+` blanche centrée |

---

## 9. Performances

- `FlatList` : `getItemLayout` height fixe = `Dimensions.get('window').height`
- Images : `react-native-fast-image` avec cache mémoire + disque
- Vidéos : composant player détruit à plus de 2 items du current
- `renderItem` : `useCallback` + `React.memo` sur `VideoItem`
- Redux : `reselect` pour les sélecteurs dérivés
- Firestore : `.onSnapshot()` uniquement pour comments et notifications, `.get()` partout ailleurs

---

## 10. Gestion d'Erreurs

- Toutes les calls Firebase dans `try/catch`
- Erreurs réseau → toast "Pas de connexion internet"
- Upload échoué → bouton retry + vidéo conservée localement
- Erreurs auth mappées :
  - `auth/wrong-password` → "Mot de passe incorrect"
  - `auth/email-already-in-use` → "Email déjà utilisé"
- États vides sur chaque liste avec illustration + message
- Skeleton loaders sur feed, grille profil, grille discover

---

## 11. Plan de Build — 3 Vagues Parallèles

### Vague 1 — Fondations (agents A, B, C, D en parallèle)
| Agent | Contenu |
|---|---|
| **A** | `theme/`, `config/firebase.ts`, `utils/`, `src/assets/` |
| **B** | `services/firebase/` — auth, videos, users, comments, likes, storage + notifications |
| **C** | `store/` — authSlice, feedSlice, playerSlice, uiSlice + RTK Query (videosApi, usersApi) |
| **D** | `navigation/` — AppNavigator, AuthNavigator, MainNavigator, tabBarConfig + stubs de toutes les screens |

### Vague 2 — Screens & Composants (agents E–J en parallèle après Vague 1)
| Agent | Contenu |
|---|---|
| **E** | WelcomeScreen, LoginScreen, RegisterScreen + `useAuth` |
| **F** | HomeScreen + VideoItem, VideoActions, VideoInfo, MusicDisc, DoubleTapLike, FollowButton + useVideoPlayer, useDoubleTap, useLike |
| **G** | CameraScreen, PostScreen + `useUpload` |
| **H** | DiscoverScreen + SearchBar, TrendingHashtags, VideoGrid |
| **I** | ProfileScreen, EditProfileScreen, InboxScreen + ProfileHeader, ProfileStats, ProfileVideoGrid |
| **J** | CommentSheet, CommentItem, CommentInput + `useFollow` |

### Vague 3 — Finalisation (séquentiel)
- Composants communs : Avatar, Button, Loader, SkeletonLoader, TabBarIcon
- `scripts/seedFirestore.ts`
- `README.md` mis à jour avec instructions de setup Android + Firebase
- Connexion finale de tous les imports croisés

---

## 12. Seed Script (`scripts/seedFirestore.ts`)

Données à créer :
- 5 comptes utilisateurs demo dans Firebase Auth + Firestore
- 20 documents `videos/` avec URLs publiques de vidéos sample
- Likes et commentaires sur chaque vidéo
- Relations de follow entre les users

---

## 13. Règles de Qualité du Code

- Aucun style inline — toujours `StyleSheet.create()`
- Aucune couleur hardcodée — toujours depuis `theme/colors.ts`
- Aucune chaîne hardcodée — depuis `utils/constants.ts`
- Chaque screen gère : état loading, état erreur, état vide
- Toutes les opérations async annulables (cleanup dans `useEffect` return)
- Listeners Firebase désabonnés dans le cleanup `useEffect`
- Nommage : composants PascalCase, hooks camelCase préfixe `use`
