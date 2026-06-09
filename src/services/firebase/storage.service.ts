import storage from '@react-native-firebase/storage';
import { STORAGE_PATHS } from '../../utils/constants';

export async function uploadVideo(uid: string, localUri: string, onProgress: (progress: number) => void): Promise<string> {
  const path = STORAGE_PATHS.videos(uid, Date.now());
  const ref = storage().ref(path);
  const task = ref.putFile(localUri);
  task.on('state_changed', snapshot => {
    onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
  });
  await task;
  return await ref.getDownloadURL();
}

export async function uploadAvatar(uid: string, localUri: string): Promise<string> {
  const ref = storage().ref(STORAGE_PATHS.avatars(uid));
  await ref.putFile(localUri);
  return await ref.getDownloadURL();
}

export async function deleteVideo(videoUrl: string): Promise<void> {
  await storage().refFromURL(videoUrl).delete();
}
