import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { getToken, getRefreshToken } from '../api/cookiesOperation';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  prepareHeaders: async (headers) => {
    const token = await getToken();
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include',
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        { url: '/auth/regenerate-token', method: 'POST', body: { refreshToken } },
        api,
        extraOptions
      );
      if (refreshResult.data) {
        result = await rawBaseQuery(args, api, extraOptions);
      }
    }
  }

  return result;
};
