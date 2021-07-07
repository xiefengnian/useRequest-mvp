import { useState, useEffect } from 'react';

/**
 *
 * @param {boolean} ready
 */
const useReadyPlugin = (ready) => {
  return {
    run: (runImplement) => {
      if (ready) {
        return runImplement;
      } else {
        return () => {};
      }
    },
  };
};

export default useReadyPlugin;
