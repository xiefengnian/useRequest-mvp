import useRequest from './index';
import React from 'react';

const getUser = (username) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('your username is : ' + username);
    }, 800);
  });

const Demo = () => {
  const request = useRequest(getUser, {
    defaultParams: 'aaaa',
    pollingInterval: 2000,
    pollingWhenHidden: true,
  });
  return (
    <div>
      useRequest MVP
      <div>{request.loading ? 'loading' : 'done'}</div>
      <div>data : {request.data}</div>
      <button onClick={() => request.run('bbbb')}>refetch</button>
    </div>
  );
};

export default Demo;
