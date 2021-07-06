import { useState, useEffect, useRef } from 'react';

const useRequestImplement = (fetcher, options) => {
  const { manual, defaultParams, plugins, onSuccess, onError } = options;

  //basic
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const paramsCache = useRef(null);

  const getParamWithCache = (params) => {
    if (params) {
      paramsCache.current = params;
      return params;
    } else {
      return paramsCache.current;
    }
  };

  const run = (params) => {
    let runParams = getParamWithCache(params);
    console.log('function:run.params', params, runParams);
    console.log('ref:paramsCache', paramsCache.current);
    setLoading(true);
    fetcher(runParams)
      .then((res) => {
        setData(res);
        onSuccess(res, runParams);
        plugins.forEach((plugin) => {
          if (plugin.onSuccess) {
            plugin.onSuccess(res);
          }
        });
      })
      .catch((err) => {
        setError(err);
        onError(err, runParams);
        plugins.forEach((plugin) => {
          if (plugin.onError) {
            plugin.onError(err);
          }
        });
        console.log('fetch:error', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const runAsync = (params) => {
    let runParams = getParamWithCache(params);
    return fetcher(runParams);
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
    run,
    runAsync,
    ...pluginReturns,
  };
};

const useRequestParallel = (fetcher, options) => {
  const { fetchKey, onError, onSuccess, plugins } = options;

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

  const run = (params) => {
    const key = fetchKey(params);
    const fetchState = getFetch(key);
    fetchState.setLoading(true);
    fetcher(params)
      .then((res) => {
        fetchState.setData(res);
        onSuccess(res);
      })
      .catch((err) => {
        fetchState.setError(err);
        onError(err);
      })
      .finally(() => {
        fetchState.setLoading(false);
      });
  };

  return {
    fetches,
    run,
  };
};

const useRequest = (fetcher, options) => {
  if (options.fetchKey) {
    return useRequestParallel(fetcher, options);
  }
  return useRequestImplement(fetcher, options);
};

export default useRequest;
