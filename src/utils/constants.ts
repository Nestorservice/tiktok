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
