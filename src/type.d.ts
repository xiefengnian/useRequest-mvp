declare module 'useRequest' {
  type useRequestReturn<T = any, P = any> = {
    data: T;
    loading: boolean;
    error: Error;
    defaultParams: P;
    run: (params: P) => void;
    runAsync: (params: P) => Promise<T>;
    [pluginReturns: string]: any;
  };
  export default function <T = any, P = any>(
    fetcher: Promise<T>,
    options: useRequestOptions<P>
  ): useRequestReturn;
  export type RunImplement = Function;
  export type RequestState<T = any> = {
    data: T;
    loading: boolean;
    error: Error;
  };
  export type useRequestOptions<P> = {
    plugins: Object[];
    defaultParams: P;
  };

  export type useRequestPluginReturn<T = any, R = any, P = any> = {
    run?: (runImplement: RunImplement) => RunImplement;
    init?: (state: RequestState<T>, context: RunImplement, options: useRequestOptions<P>) => void;
    onSuccess?: (params: any, res: R) => void | Promise<void>;
    onError?: (params: any, err: Error) => void | Promise<void>;
    onBefore?: (params: any) => void | Promise<void>;
    onComplete?: (params: any) => void | Promise<void>;
    returns?: Record<string, any>;
  };
}

// declare function useRequest(fetcher: Promise<T>, options: useRequestOptions): useRequestReturn;
// export type useRequest<T> = (fetcher: Promise<T>, options: useRequestOptions) => useRequestReturn;
