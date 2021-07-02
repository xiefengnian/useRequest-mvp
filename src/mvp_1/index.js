import { useState, useEffect, useRef } from 'react';
import PollingPlugin from './plugins/polling';

const useRequest = (fetcher, options) => {
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
  useEffect(() => {
    const allUnmount = [];
    plugins.forEach((plugin) => {
      console.log(plugin.constructor.name, plugin);
      plugin.plugin(state, ctx);
      const { mount, unmount } = plugin;
      mount();
      allUnmount.push(unmount);
    });
    return () => {
      allUnmount.forEach((unmount) => unmount());
    };
  }, []);

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

const useRequestDefault = (fetcher, options) => {
  const defaultPlugins = [];
  const { plugins = [] } = options;
  const { pollingInterval, pollingWhenHidden } = options;

  const modifies = [];

  if (!!pollingInterval) {
    const { modifyOptionsOrder, modifyOptions } = PollingPlugin;
    defaultPlugins.push(new PollingPlugin({ pollingInterval, pollingWhenHidden }));
    modifies.push({
      modifyOptionsOrder,
      modifyOptions,
    });
  }

  modifies
    .sort((a, b) => a.modifyOptionsOrder - b.modifyOptionsOrder)
    .forEach((modify) => {
      options = modify.modifyOptions(options);
    });

  return useRequest(fetcher, {
    ...options,
    plugins: plugins.concat(defaultPlugins),
  });
};

export default useRequestDefault;
