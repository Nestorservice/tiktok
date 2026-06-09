import { useState, useCallback } from 'react';
import { Video as CompressorVideo } from 'react-native-compressor';
import { uploadVideo } from '../services/firebase/storage.service';
import { createVideoDocument } from '../services/firebase/videos.service';
import { useAppSelector } from '../store/hooks';

interface UploadParams {
  localUri: string; description: string; hashtags: string[];
  musicName: string; duration: number; thumbnailUrl: string;
}

export function useUpload() {
  const uid = useAppSelector(s => s.auth.user?.uid);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (params: UploadParams): Promise<boolean> => {
    if (!uid) return false;
    setIsUploading(true); setError(null); setProgress(0);
    try {
      const compressed = await CompressorVideo.compress(params.localUri, { compressionMethod: 'auto' });
      const videoUrl = await uploadVideo(uid, compressed, pct => setProgress(pct));
      await createVideoDocument({ videoId: '', authorId: uid, videoUrl, thumbnailUrl: params.thumbnailUrl, description: params.description, hashtags: params.hashtags, musicName: params.musicName, likesCount: 0, commentsCount: 0, sharesCount: 0, viewsCount: 0, duration: params.duration, isPublic: true });
      return true;
    } catch { setError('Échec de la publication. Réessaie.'); return false; }
    finally { setIsUploading(false); }
  }, [uid]);

  return { upload, progress, isUploading, error };
}
