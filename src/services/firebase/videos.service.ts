import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { COLLECTIONS, FEED_PAGE_SIZE } from '../../utils/constants';
import { Video } from '../../types';

export async function fetchFeedVideos(
  lastDoc?: FirebaseFirestoreTypes.DocumentSnapshot,
): Promise<{ videos: Video[]; lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null }> {
  let query = firestore().collection(COLLECTIONS.videos)
    .where('isPublic', '==', true).orderBy('createdAt', 'desc').limit(FEED_PAGE_SIZE);
  if (lastDoc) query = query.startAfter(lastDoc);
  const snap = await query.get();
  const videos = snap.docs.map(d => d.data() as Video);
  const newLastDoc = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;
  return { videos, lastDoc: newLastDoc };
}

export async function getVideosByUser(uid: string): Promise<Video[]> {
  const snap = await firestore().collection(COLLECTIONS.videos)
    .where('authorId', '==', uid).orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => d.data() as Video);
}

export async function createVideoDocument(video: Omit<Video, 'createdAt'>): Promise<string> {
  const ref = firestore().collection(COLLECTIONS.videos).doc();
  await ref.set({ ...video, videoId: ref.id, createdAt: firestore.FieldValue.serverTimestamp() });
  await firestore().collection(COLLECTIONS.users).doc(video.authorId)
    .update({ videosCount: firestore.FieldValue.increment(1) });
  return ref.id;
}

export async function incrementVideoViews(videoId: string): Promise<void> {
  await firestore().collection(COLLECTIONS.videos).doc(videoId)
    .update({ viewsCount: firestore.FieldValue.increment(1) });
}

export async function searchVideos(query: string): Promise<Video[]> {
  const snap = await firestore().collection(COLLECTIONS.videos)
    .where('isPublic', '==', true).orderBy('description')
    .startAt(query).endAt(query + '\uf8ff').limit(20).get();
  return snap.docs.map(d => d.data() as Video);
}
