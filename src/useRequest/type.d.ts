declare module 'useRequest' {}
export type RunImplement = Function;
export type RequestState<T = any> = {
  data: T;
  loading: boolean;
  error: Error;
};
export type useRequestOptions = {
  plugins: Object[];
};

export type useRequestPluginReturn<T = any, R = any> = {
  run?: (runImplement: RunImplement) => RunImplement;
  init?: (state: RequestState<T>, context: RunImplement, options: useRequestOptions) => void;
  onSuccess?: (params: any, res: R) => void | Promise<void>;
  onError?: (params: any, err: Error) => void | Promise<void>;
  onBefore?: (params: any) => void | Promise<void>;
  onComplete?: (params: any) => void | Promise<void>;
  returns?: Record<string, any>;
};

type useRequestReturn<T = any> = {
  data: T;
  loading: boolean;
  error: Error;
  run: (...args) => void;
  runAsync: (...args) => Promise<T>;
  [pluginReturns: string]: any;
};

export type useRequest<T> = (fetcher: Promise<T>, options: useRequestOptions) => useRequestReturn;
