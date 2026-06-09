import { useRef, useCallback } from 'react';
import { DOUBLE_TAP_DELAY } from '../utils/constants';

export function useDoubleTap(onSingleTap: () => void, onDoubleTap: () => void) {
  const lastTap = useRef<number>(0);
  return useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      lastTap.current = 0;
      onDoubleTap();
    } else {
      lastTap.current = now;
      setTimeout(() => {
        if (lastTap.current !== 0 && Date.now() - lastTap.current >= DOUBLE_TAP_DELAY) {
          lastTap.current = 0;
          onSingleTap();
        }
      }, DOUBLE_TAP_DELAY);
    }
  }, [onSingleTap, onDoubleTap]);
}
