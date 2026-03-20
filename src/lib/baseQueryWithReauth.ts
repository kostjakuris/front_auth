import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();
const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  credentials: 'include',
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async(args, api, extraOptions) => {
  const isAuth = localStorage.getItem('isAuth');
  await mutex.waitForUnlock();
  let result = await rawBaseQuery(args, api, extraOptions);
  
  if (result.error?.status === 401 && isAuth && isAuth === 'true') {
    if (!mutex.isLocked()) {
      const refreshResult = await rawBaseQuery(
        {url: '/auth/regenerate-token', method: 'POST'},
        api,
        extraOptions
      );
      if (refreshResult.data) {
        result = await rawBaseQuery(args, api, extraOptions);
      }
    } else {
      await mutex.waitForUnlock();
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }
  
  return result;
};
