import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ResetPasswordParams } from '../interfaces/form.interface';
import { getToken } from '../api/cookiesOperation';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    prepareHeaders: async(headers) => {
      const token = await getToken();
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include'
  }),
  endpoints: (build) => ({
    logout: build.query({
      query: () => ({
        url: '/auth/logout',
      }),
    }),
    sendResetLink: build.mutation({
      query: (email: string) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: {email},
        responseHandler: 'text'
      }),
    }),
    resetPassword: build.mutation({
      query: ({token, password}: ResetPasswordParams) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: {token, password},
        responseHandler: 'text'
      }),
    }),
    regenerateToken: build.mutation({
      query: (refreshToken: string) => ({
        url: '/auth/regenerate-token',
        method: 'POST',
        body: {refreshToken}
      }),
    }),
  }),
});

export const {
  useLazyLogoutQuery,
  useResetPasswordMutation,
  useSendResetLinkMutation,
  useRegenerateTokenMutation
} = authApi;