import React, { useRef, useState } from 'react';
import useRequest from 'useRequest';
import useDebouncePlugin from './useRequest/plugins/useDebouncePlugin';
import useFetchKey from './useRequest/plugins/useFetchKeyPlugin';
import useLoadingDelayPlugin from './useRequest/plugins/useLoadingDelayPlugin';

import usePollingPlugin from './useRequest/plugins/usePollingPlugin';
import useReadyPlugin from './useRequest/plugins/useReadyPlugin';
import useRefreshOnWindowFocusPlugin from './useRequest/plugins/useRefreshOnWindowFocusPlugin';
import useSomePlugin from './useRequest/plugins/useSomePlugin';
import useThrottlePlugin from './useRequest/plugins/useThrottlePlugin';

const getUser = (firstName, lastName) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('your username is : ' + firstName + '·' + lastName);
      // reject('error is happening');
    }, 800);
  });

const users = [
  {
    id: 1,
    username: 'xiaoming',
  },
  {
    id: 2,
    username: 'xiaohong',
  },
  {
    id: 3,
    username: 'xiaohua',
  },
];

const DebounceDemo = () => {
  const debouncePlugin = useDebouncePlugin(1000);
  const throttlePlugin = useThrottlePlugin(2000);
  const readyPlugin = useReadyPlugin(true);
  const loadingDelayPlugin = useLoadingDelayPlugin(5000);
  const countPlugin = useSomePlugin();
  const refreshPlugin = useRefreshOnWindowFocusPlugin();
  const request = useRequest(getUser, {
    plugins: [throttlePlugin, countPlugin, readyPlugin, loadingDelayPlugin, refreshPlugin],
    defaultParams: ['foo', 'bar'],
  });
  console.log('DebounceDemo', request);
  return (
    <div>
      <h2>防抖</h2>
      <ul>
        <li>count : {request.successCount}</li>
        <li>data : {request.data}</li>
        <li>loading : {request.loading ? 'loading' : 'wait'}</li>
        <li>error : {request.error ? request.error : 'none'}</li>
      </ul>
      <button onClick={() => request.run('foo', 'bar')}>run</button>
    </div>
  );
};

const Demo = () => {
  // const countPlugin = useSomePlugin();
  // const pollingPlugin = usePollingPlugin();
  // const fetchKeyPlugin = useFetchKey();

  // const request = useRequest(getUser, {
  //   plugins: [countPlugin, pollingPlugin, fetchKeyPlugin],
  //   defaultParams: 'xiaoming',
  //   manual: true,
  //   debounceWait: 2000,
  //   onError: () => {},
  //   onSuccess: (data) => {},
  // });

  // const { fetches } = request;
  // console.log(request);

  return (
    <div>
      {/* <ul>
        <li>count : {request.successCount}</li>
        <li>data : {request.data}</li>
        <li>loading : {request.loading ? 'loading' : 'wait'}</li>
        <li>error : {request.error ? request.error : 'none'}</li>
      </ul>
      <button onClick={() => request.run('xiaohong')}>run</button>
      <h3>并行请求</h3>
      <div>You can click all buttons, each request has its own status.</div> */}
      {/* <ul>
        {users.map((user) => (
          <li key={user.id} style={{ marginTop: 8 }}>
            <button
              type="button"
              onClick={() => {
                request.run(user.id);
              }}
              disabled={fetches[user.id]?.loading}
            >
              {fetches[user.id]?.loading ? 'loading' : `delete ${user.username}`}
            </button>
          </li>
        ))}
      </ul> */}
      <DebounceDemo></DebounceDemo>
    </div>
  );
};

export default Demo;
