import { createApi } from '@reduxjs/toolkit/query/react';
import { ResetPasswordParams } from '../interfaces/form.interface';
import { baseQueryWithReauth } from './baseQueryWithReauth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
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
    
  }),
});

export const {
  useLazyLogoutQuery,
  useResetPasswordMutation,
  useSendResetLinkMutation,
} = authApi;