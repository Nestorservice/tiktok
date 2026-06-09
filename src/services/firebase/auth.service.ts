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
  const user: any = {
    uid, username, displayName, bio: '', avatar: '',
    followersCount: 0, followingCount: 0, videosCount: 0,
    isPrivate: false, isVerified: false,
    createdAt: firestore.FieldValue.serverTimestamp(),
  };
  await firestore().collection(COLLECTIONS.users).doc(uid).set(user);
  return user as User;
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
  const snap = await firestore().collection(COLLECTIONS.users)
    .where('username', '==', username).limit(1).get();
  return snap.empty;
}
