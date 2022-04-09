/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from 'react';

export const useDelay = (fn: (...args: any) => void, ms = 500) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const delayCallBack = useCallback(
    (...args: any) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(fn.bind(this, ...args), ms);
    },
    [fn, ms],
  );

  return delayCallBack;
};
