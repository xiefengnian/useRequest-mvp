import React from 'react';
import ReactDOM from 'react-dom';

import useRequest from '../index';

const getUser = (username) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('your username is : ' + username);
    }, 800);
  });

const App = () => {
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
ReactDOM.render(<App></App>, document.getElementById('root'));
