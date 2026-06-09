import firestore from '@react-native-firebase/firestore';
import { COLLECTIONS, SUBCOLLECTIONS } from '../../utils/constants';
import { User } from '../../types';

export async function getUserById(uid: string): Promise<User | null> {
  const doc = await firestore().collection(COLLECTIONS.users).doc(uid).get();
  if (!doc.exists) return null;
  return doc.data() as User;
}

export function subscribeToUser(uid: string, callback: (user: User | null) => void): () => void {
  return firestore().collection(COLLECTIONS.users).doc(uid)
    .onSnapshot(snap => callback(snap.exists ? snap.data() as User : null));
}

export async function updateUserProfile(uid: string, updates: Partial<Pick<User, 'displayName' | 'bio' | 'avatar'>>): Promise<void> {
  await firestore().collection(COLLECTIONS.users).doc(uid).update(updates);
}

export async function isFollowing(currentUid: string, targetUid: string): Promise<boolean> {
  const doc = await firestore().collection(COLLECTIONS.users).doc(currentUid)
    .collection(SUBCOLLECTIONS.following).doc(targetUid).get();
  return doc.exists;
}

export async function followUser(currentUid: string, targetUid: string): Promise<void> {
  const batch = firestore().batch();
  const followRef = firestore().collection(COLLECTIONS.users).doc(currentUid)
    .collection(SUBCOLLECTIONS.following).doc(targetUid);
  batch.set(followRef, { followedAt: firestore.FieldValue.serverTimestamp() });
  batch.update(firestore().collection(COLLECTIONS.users).doc(currentUid), { followingCount: firestore.FieldValue.increment(1) });
  batch.update(firestore().collection(COLLECTIONS.users).doc(targetUid), { followersCount: firestore.FieldValue.increment(1) });
  await batch.commit();
}

export async function unfollowUser(currentUid: string, targetUid: string): Promise<void> {
  const batch = firestore().batch();
  const followRef = firestore().collection(COLLECTIONS.users).doc(currentUid)
    .collection(SUBCOLLECTIONS.following).doc(targetUid);
  batch.delete(followRef);
  batch.update(firestore().collection(COLLECTIONS.users).doc(currentUid), { followingCount: firestore.FieldValue.increment(-1) });
  batch.update(firestore().collection(COLLECTIONS.users).doc(targetUid), { followersCount: firestore.FieldValue.increment(-1) });
  await batch.commit();
}
