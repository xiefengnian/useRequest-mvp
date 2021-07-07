import { useState, useEffect, useRef } from 'react';

const useRequestImplement = (fetcher, options) => {
  const { manual, defaultParams, plugins = [], onSuccess, onError } = options;

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

  const runPluginHandler = async (event, ...args) => {
    for (let plugin of plugins) {
      if (plugin[event]) {
        await plugin[event](args);
      }
    }
  };

  const runImplement = (...params) => {
    // params : ['foo','bar']
    (async () => {
      let runParams = getParamWithCache(params);
      setLoading(true);
      await runPluginHandler('onBefore', runParams);

      fetcher(...runParams)
        .then(async (res) => {
          await runPluginHandler('onSuccess', runParams, res);
          setData(res);
          onSuccess && onSuccess(res, runParams);
        })
        .catch(async (err) => {
          await runPluginHandler('onError', runParams, err);
          setError(err);
          onError && onError(err, runParams);
          console.log('fetch:error', err);
        })
        .finally(async () => {
          await runPluginHandler('onComplete', runParams);
          setLoading(false);
        });
    })();
  };

  let run = runImplement;
  plugins.forEach((plugin) => {
    if (plugin.run) {
      run = plugin.run(runImplement);
    }
  });

  const runAsync = (...params) => {
    let runParams = getParamWithCache(...params);
    return fetcher(...runParams);
  };

  const state = { loading, data, error };
  const ctx = { run };
  plugins.forEach((plugin) => {
    if (plugin.init) {
      plugin.init(state, ctx, options);
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

const useRequest = (fetcher, options) => {
  return useRequestImplement(fetcher, options);
};

export default useRequest;
