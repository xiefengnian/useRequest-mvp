import {useEffect, useRef, useState} from 'react'

/**
 * 
 * @param {number} pollingInterval 
 * @param {boolean} pollingWhenHidden 
 * @returns 
 */
const usePollingPlugin = (pollingInterval = 1000,pollingWhenHidden = false) => {
  const stateRef = useRef();
  const ctxRef = useRef();

  const [suspended,setSuspended] = useState(false);

  const onSuccess = () => {
    setTimeout(() => {
      if(!suspended){
        ctxRef.current.run();
      }
    }, pollingInterval);
  };

  useEffect(()=>{
    if(pollingWhenHidden){
      const handleVisibilityChange = ()=>{
        if(document.hidden){
          setSuspended(true);
        } else {
          setSuspended(false);
        }
      }
      document.addEventListener('visibilitychange',handleVisibilityChange);
      return ()=>{
        document.removeEventListener('visibilitychange',handleVisibilityChange);
      }
    }
  });

  return {
    onSuccess,
    init: (state, context) => {
      stateRef.current = state;
      ctxRef.current = context;
    },
  };
};

export default usePollingPlugin;
