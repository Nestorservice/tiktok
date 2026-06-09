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
