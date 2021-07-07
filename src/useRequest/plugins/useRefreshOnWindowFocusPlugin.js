import { useEffect, useRef } from 'react';

const useRefreshOnWindowFocusPlugin = () => {
  const stateRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    const handleWindowFocus = () => {
      contextRef.current?.run();
    };
    window.addEventListener('focus', handleWindowFocus);
    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  return {
    init: (state, context, options) => {
      console.log(options);
      stateRef.current = state;
      contextRef.current = context;
    },
  };
};

export default useRefreshOnWindowFocusPlugin;
