import { useState, useEffect, useRef } from 'react';

const useRequestImplement = (fetcher, options) => {
  const { manual, defaultParams, plugins } = options;

  //basic
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const paramsCache = useRef(null);

  const run = (params) => {
    let runParams = params;
    if (!params) {
      runParams = paramsCache.current;
    } else {
      paramsCache.current = params;
    }
    console.log(runParams);
    setLoading(true);
    fetcher(runParams)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!manual) {
      run(defaultParams);
    }
  }, []);

  // plugins
  const ctx = { setData, setLoading, setError, run };
  const state = { data, loading, error };

  plugins.forEach((plugin) => {
    plugin.init(state, ctx);
  });

  return {
    data,
    error,
    loading,
    run: (params) => {
      run(params);
    },
    runAsync: (params) => {
      let runParams = params;
      if (!params) {
        runParams = paramsCache.current;
      } else {
        paramsCache.current = params;
      }
      return fetcher(runParams);
    },
  };
};

const useRequest = (fetcher, options) => {
  return useRequestImplement(fetcher, options);
};

export default useRequest;
