import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import { COLLECTIONS, SUBCOLLECTIONS } from '../utils/constants';
import { Notification } from '../types';

export async function requestNotificationPermission(): Promise<boolean> {
  const status = await messaging().requestPermission();
  return status === messaging.AuthorizationStatus.AUTHORIZED || status === messaging.AuthorizationStatus.PROVISIONAL;
}

export async function saveFCMToken(uid: string): Promise<void> {
  const token = await messaging().getToken();
  await firestore().collection(COLLECTIONS.users).doc(uid).update({ fcmToken: token });
}

export function subscribeToNotifications(uid: string, callback: (notifications: Notification[]) => void): () => void {
  return firestore().collection(COLLECTIONS.notifications).doc(uid)
    .collection(SUBCOLLECTIONS.notifItems).orderBy('createdAt', 'desc')
    .onSnapshot(snap => callback(snap.docs.map(d => d.data() as Notification)));
}

export async function markNotificationRead(uid: string, notifId: string): Promise<void> {
  await firestore().collection(COLLECTIONS.notifications).doc(uid)
    .collection(SUBCOLLECTIONS.notifItems).doc(notifId).update({ isRead: true });
}
