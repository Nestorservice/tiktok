import firestore from '@react-native-firebase/firestore';
import { COLLECTIONS, SUBCOLLECTIONS } from '../../utils/constants';

export async function toggleLike(videoId: string, uid: string, currentlyLiked: boolean): Promise<void> {
  const likeRef = firestore().collection(COLLECTIONS.videos).doc(videoId)
    .collection(SUBCOLLECTIONS.likes).doc(uid);
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
  const doc = await firestore().collection(COLLECTIONS.videos).doc(videoId)
    .collection(SUBCOLLECTIONS.likes).doc(uid).get();
  return doc.exists;
}
