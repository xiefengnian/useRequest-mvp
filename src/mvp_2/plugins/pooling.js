import { useState, useEffect, useRef } from 'react';

const usePoolingPlugin = (pollingInterval, pollingWhenHidden) => {
  const [suspended, setSuspended] = useState(false);

  const _state = useRef();
  const _context = useRef();

  console.log('in plugin:state', _state);

  const runner = () => {
    if (!suspended) {
      _context.current.run();
    }
  };

  const handleVisibilityChange = (e) => {
    if (document.hidden) {
      setSuspended(true);
    } else {
      setSuspended(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      runner();
    }, pollingInterval);

    if (pollingWhenHidden) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  return {
    init: (state, context) => {
      _state.current = state;
      _context.current = context;
    },
  };
};

export default usePoolingPlugin;
