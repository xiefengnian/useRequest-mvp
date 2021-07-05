import React, { useRef, useState } from 'react';
import useRequest from './index';

const getUser = (username) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('your username is : ' + username);
    }, 800);
  });

const useSomePlugin = () => {
  const [state, setState] = useState(0);

  const onSuccess = () => {
    setState((s) => s + 1);
  };

  const onError = () => {
    setState((s) => s - 1);
  };

  return {
    onSuccess,
    onError,
    returns: {
      successCount: state,
    },
  };
};

const usePollingPlugin = () => {
  const stateRef = useRef();
  const ctxRef = useRef();

  const onSuccess = () => {
    setTimeout(() => {
      ctxRef.current.run();
    }, 3000);
  };

  return {
    onSuccess,
    init: (state, context) => {
      stateRef.current = state;
      ctxRef.current = context;
    },
  };
};

const Demo = () => {
  const countPlugin = useSomePlugin();
  const pollingPlugin = usePollingPlugin();

  const request = useRequest(getUser, {
    plugins: [countPlugin, pollingPlugin],
  });

  return (
    <div>
      <ul>
        <li>count : {request.successCount}</li>
      </ul>
      <button onClick={() => request.run()}>run</button>
    </div>
  );
};

export default Demo;
