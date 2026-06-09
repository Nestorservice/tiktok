import { useCallback } from 'react';
import { useAppSelector } from '../store/hooks';
import { followUser, unfollowUser } from '../services/firebase/users.service';

export function useFollow() {
  const currentUid = useAppSelector(s => s.auth.user?.uid);
  const follow = useCallback(async (targetUid: string, isFollowing: boolean) => {
    if (!currentUid || currentUid === targetUid) return;
    if (isFollowing) await unfollowUser(currentUid, targetUid);
    else await followUser(currentUid, targetUid);
  }, [currentUid]);
  return { follow };
}
