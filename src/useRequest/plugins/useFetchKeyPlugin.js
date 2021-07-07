import { useState, useEffect } from 'react';

const useFetchKey = (fetchKey = (key) => key) => {
  const [fetches, setFetches] = useState({});

  const getFetch = (key) => {
    let fetch = fetches[key];
    if (!fetch) {
      fetch = {
        loading: false,
        data: null,
        error: null,
      };
    }
    return {
      setData: (data) => {
        fetch['data'] = data;
        setFetches({ ...fetches, [key]: fetch });
      },
      setLoading: (loading) => {
        fetch['loading'] = loading;
        setFetches({ ...fetches, [key]: fetch });
      },
      setError: (error) => {
        fetch['error'] = error;
        setFetches({ ...fetches, [key]: fetch });
      },
    };
  };

  const onBefore = (params) => {
    const key = fetchKey(params);
    let fetchState = getFetch(key);
    fetchState.setLoading(true);
  };

  const onComplete = (params) => {
    const key = fetchKey(params);
    let fetchState = getFetch(key);
    fetchState.setLoading(false);
  };

  const onError = (params, error) => {
    const key = fetchKey(params);
    let fetchState = getFetch(key);
    fetchState.setError(error);
  };

  const onSuccess = (params, res) => {
    const key = fetchKey(params);
    let fetchState = getFetch(key);
    fetchState.setData(res);
  };

  return {
    onBefore,
    onComplete,
    onSuccess,
    onError,
    returns: {
      fetches,
    },
  };
};

export default useFetchKey;
