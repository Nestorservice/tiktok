import firestore from '@react-native-firebase/firestore';
import { COLLECTIONS, SUBCOLLECTIONS } from '../../utils/constants';
import { Comment } from '../../types';

export function subscribeToComments(videoId: string, callback: (comments: Comment[]) => void): () => void {
  return firestore().collection(COLLECTIONS.videos).doc(videoId)
    .collection(SUBCOLLECTIONS.comments).orderBy('createdAt', 'desc')
    .onSnapshot(snap => callback(snap.docs.map(d => d.data() as Comment)));
}

export async function addComment(videoId: string, authorId: string, text: string): Promise<void> {
  const ref = firestore().collection(COLLECTIONS.videos).doc(videoId)
    .collection(SUBCOLLECTIONS.comments).doc();
  const batch = firestore().batch();
  batch.set(ref, { commentId: ref.id, authorId, text, likesCount: 0, createdAt: firestore.FieldValue.serverTimestamp() });
  batch.update(firestore().collection(COLLECTIONS.videos).doc(videoId), { commentsCount: firestore.FieldValue.increment(1) });
  await batch.commit();
}

export async function deleteComment(videoId: string, commentId: string): Promise<void> {
  const batch = firestore().batch();
  const commentRef = firestore().collection(COLLECTIONS.videos).doc(videoId)
    .collection(SUBCOLLECTIONS.comments).doc(commentId);
  batch.delete(commentRef);
  batch.update(firestore().collection(COLLECTIONS.videos).doc(videoId), { commentsCount: firestore.FieldValue.increment(-1) });
  await batch.commit();
}
