import { debounce } from 'lodash';

const useDebouncePlugin = (wait) => {
  return {
    run: (runImplement) => {
      return debounce((...args) => runImplement(...args), wait);
    },
  };
};

export default useDebouncePlugin;
