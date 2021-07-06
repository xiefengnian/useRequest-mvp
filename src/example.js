import React, { useRef, useState } from 'react';
import useRequest from './useRequest';

import usePollingPlugin from './useRequest/plugins/usePollingPlugin';
import useSomePlugin from './useRequest/plugins/useSomePlugin';

const getUser = (username) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('your username is : ' + username);
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

const Demo = () => {
  const countPlugin = useSomePlugin();
  const pollingPlugin = usePollingPlugin();

  const request = useRequest(getUser, {
    plugins: [countPlugin, pollingPlugin],
    defaultParams: 'xiaoming',
    // manual : true,
    // fetchKey: (id) => id,
    onError: () => {},
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const { fetches } = request;

  return (
    <div>
      <ul>
        <li>count : {request.successCount}</li>
        <li>data : {request.data}</li>
        <li>loading : {request.loading ? 'loading' : 'wait'}</li>
        <li>error : {request.error ? request.error : 'none'}</li>
      </ul>
      <button onClick={() => request.run('xiaohong')}>run</button>
      {/* <h3>并行请求</h3>
      <div>You can click all buttons, each request has its own status.</div>
      <ul>
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
    </div>
  );
};

export default Demo;
