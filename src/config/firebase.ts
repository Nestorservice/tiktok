import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';

export const firebaseAuth = auth();
export const firebaseFirestore = firestore();
export const firebaseStorage = storage();
export const firebaseMessaging = messaging;

export default {
  auth: firebaseAuth,
  firestore: firebaseFirestore,
  storage: firebaseStorage,
  messaging: firebaseMessaging,
};
