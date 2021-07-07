import { throttle } from 'lodash';

// TODO: 好像有点问题，需要调试
const useThrottlePlugin = (wait) => {
  return {
    run: (runImplement) => {
      return throttle((...args) => runImplement(...args), wait);
    },
  };
};

export default useThrottlePlugin;
