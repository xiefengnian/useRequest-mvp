import { useRef, useState } from 'react';
import { sleep } from '../utils';

const useLoadingDelayPlugin = (time) => {
  const startTime = useRef(0);

  return {
    onBefore: () => {
      startTime.current = Date.now();
    },
    onComplete: async () => {
      const now = Date.now();
      const difference = now - startTime.current;
      if (difference < time) {
        await sleep(time - difference);
      }
    },
  };
};

export default useLoadingDelayPlugin;
