import { createApi } from '@reduxjs/toolkit/query/react';
import { LoginFormFields, RegisterFormFields } from '../interfaces/form.interface';
import { baseQueryWithReauth } from './baseQueryWithReauth';
import { User } from './authSlice';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Todo', 'Task'],
  endpoints: (build) => ({
    register: build.mutation({
      query: ({username, email, password}: RegisterFormFields) => ({
        url: '/auth/register',
        method: 'POST',
        body: {username, email, password}
      }),
      invalidatesTags: ['User'],
    }),
    login: build.mutation({
      query: ({email, password}: LoginFormFields) => ({
        url: '/auth/login',
        method: 'POST',
        body: {email, password}
      }),
      invalidatesTags: ['User'],
    }),
    regenerateToken: build.mutation({
      query: (refreshToken: string) => ({
        url: '/auth/regenerate-token',
        method: 'POST',
        body: {refreshToken}
      }),
      invalidatesTags: ['User']
    }),
    getUserInfo: build.query<User, void>({
      query: () => ({
        url: '/auth/user',
      }),
      providesTags: ['User']
    }),
  })
});
export const {
  useGetUserInfoQuery,
  useLoginMutation,
  useRegisterMutation,
  useRegenerateTokenMutation,
} = userApi;