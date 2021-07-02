import React from 'react';

import usePoolingPlugin from './plugins/pooling';
import useRequest from './index';

const getUser = (username) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('your username is : ' + username);
    }, 800);
  });

const Demo = () => {
  const pollingPlugin = usePoolingPlugin(2000, true);
  const { data, loading, error } = useRequest(getUser, {
    plugins: [pollingPlugin],
    defaultParams: 'xiao,ming',
  });
  return (
    <div>
      <ul>
        <li>data : {data}</li>
        <li>loading : {loading ? 'loading...' : 'done'}</li>
        <li>error : {error ? 'Error' : ''}</li>
      </ul>
    </div>
  );
};

export default Demo;
