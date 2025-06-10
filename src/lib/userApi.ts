import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../api/cookiesOperation';
import {
  CreateTaskFields,
  EditTaskFields,
  EditTodoFields,
  LoginFormFields,
  RegisterFormFields
} from '../interfaces/form.interface';

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
    getUserInfo: build.query({
      query: () => ({
        url: '/auth/user',
      }),
      providesTags: ['User']
    }),
    getAllTodos: build.query({
      query: () => ({
        url: '/todo/all',
      }),
      providesTags: ['User', 'Todo']
    }),
    getAllTasks: build.query({
      query: (id: string) => ({
        url: `/task/all?id=${id}`,
      }),
      providesTags: ['Task']
    }),
    createNewTodo: build.mutation({
      query: (name: string) => ({
        url: `/todo/create`,
        method: 'POST',
        body: {name}
      }),
      invalidatesTags: ['Todo']
    }),
    createNewTask: build.mutation({
      query: ({name, description, parentId, todoId}: CreateTaskFields) => ({
        url: `/task/create`,
        method: 'POST',
        body: {name, description, parentId, id: todoId}
      }),
      invalidatesTags: ['Task']
    }),
    deleteTodo: build.mutation({
      query: (id: number) => ({
        url: `/todo/delete`,
        method: 'DELETE',
        body: {id}
      }),
      invalidatesTags: ['Todo']
    }),
    editTodo: build.mutation({
      query: ({id, name}: EditTodoFields) => ({
        url: `/todo/edit`,
        method: 'PATCH',
        body: {id, name}
      }),
      invalidatesTags: ['Todo']
    }),
    editTask: build.mutation({
      query: ({id, name, description, status}: EditTaskFields) => ({
        url: `/task/edit`,
        method: 'PATCH',
        body: {id, name, description, status}
      }),
      invalidatesTags: ['Task']
    }),
    deleteTask: build.mutation({
      query: (id: number) => ({
        url: `/task/delete`,
        method: 'DELETE',
        body: {id}
      }),
      invalidatesTags: ['Task']
    }),
  })
});
export const {
  useGetUserInfoQuery,
  useGetAllTodosQuery,
  useGetAllTasksQuery,
  useCreateNewTodoMutation,
  useCreateNewTaskMutation,
  useLoginMutation,
  useRegisterMutation,
  useDeleteTodoMutation,
  useDeleteTaskMutation,
  useEditTodoMutation,
  useEditTaskMutation,
} = userApi;