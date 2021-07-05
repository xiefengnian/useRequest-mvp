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
    setLoading(true);
    fetcher(runParams)
      .then((res) => {
        setData(res);
        plugins.forEach((plugin) => {
          plugin.onSuccess();
        });
      })
      .catch((err) => {
        plugins.forEach((plugin) => {
          plugin.onError(err);
        });
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const state = { loading, data, error };
  const ctx = { run };
  plugins.forEach((plugin) => {
    if (plugin.init) {
      plugin.init(state, ctx);
    }
  });

  useEffect(() => {
    if (!manual) {
      run(defaultParams);
    }
  }, []);

  const pluginReturns = plugins.reduce((memo, plugin) => {
    return {
      ...memo,
      ...(plugin.returns || {}),
    };
  }, {});

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
    ...pluginReturns,
  };
};

const useRequest = (fetcher, options) => {
  return useRequestImplement(fetcher, options);
};

export default useRequest;
