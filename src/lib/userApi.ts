import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../api/cookiesOperation';
import { LoginFormFields, RegisterFormFields } from '../interfaces/form.interface';

export const userApi = createApi({
  reducerPath: 'userApi',
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
  tagTypes: ['User', 'Todo', 'Task'],
  endpoints: (build) => ({
    register: build.mutation({
      query: ({username, email, password}: RegisterFormFields) => ({
        url: '/auth/register',
        method: 'POST',
        body: {username, email, password}
      }),
      invalidatesTags: ['Todo']
    }),
    login: build.mutation({
      query: ({email, password}: LoginFormFields) => ({
        url: '/auth/login',
        method: 'POST',
        body: {email, password}
      }),
      invalidatesTags: ['Todo']
    }),
    regenerateToken: build.mutation({
      query: (refreshToken: string) => ({
        url: '/auth/regenerate-token',
        method: 'POST',
        body: {refreshToken}
      }),
      invalidatesTags: ['User']
    }),
    getUserInfo: build.query({
      query: () => ({
        url: '/auth/user',
      }),
      providesTags: ['User']
    }),
    
    
  })
});
export const {
  useGetUserInfoQuery,
  useCreateNewTodoMutation,
  useLoginMutation,
  useRegisterMutation,
  useEditTodoMutation,
  useRegenerateTokenMutation,
} = userApi;