import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../api/cookiesOperation';
import { CreateRoomFields, DeleteRoomFields, EditRoomFields } from '../interfaces/form.interface';

export const roomApi = createApi({
  reducerPath: 'roomApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    prepareHeaders: async(headers) => {
      const token = await getToken();
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Room', 'JoinRoom'],
  endpoints: (build) => ({
    getAllRooms: build.query({
      query: () => ({
        url: '/room/all',
      }),
      providesTags: ['Room']
      
    }),
    getAllMessages: build.query({
      query: (id: string) => ({
        url: `/message/all?id=${id}`,
      }),
    }),
    getCurrentRoomInfo: build.query({
      query: (id: string) => ({
        url: `/room/current-room?id=${id}`,
      }),
      providesTags: ['JoinRoom']
    }),
    createNewRoom: build.mutation({
      query: ({name, ownerId}: CreateRoomFields) => ({
        url: '/room/create',
        method: 'POST',
        body: {name, ownerId},
      }),
      invalidatesTags: ['Room']
    }),
    editRoom: build.mutation({
      query: ({id, name, ownerId}: EditRoomFields) => ({
        url: '/room/edit',
        method: 'PATCH',
        body: {id, name, ownerId},
      }),
      invalidatesTags: ['Room']
    }),
    deleteRoom: build.mutation({
      query: ({id, ownerId}: DeleteRoomFields) => ({
        url: '/room/delete',
        method: 'DELETE',
        body: {id, ownerId},
      }),
      invalidatesTags: ['Room']
    }),
    joinRoom: build.mutation({
      query: (id: number) => ({
        url: '/room/join',
        method: 'POST',
        body: {id},
      }),
      invalidatesTags: ['Room', 'JoinRoom']
    }),
    isUserJoined: build.query({
      query: (id: string) => ({
        url: `/room/check?id=${id}`,
        responseHandler: 'text'
      }),
      providesTags: ['Room', 'JoinRoom']
    }),
  }),
});

export const {
  useLazyGetAllRoomsQuery,
  useCreateNewRoomMutation,
  useGetAllMessagesQuery,
  useJoinRoomMutation,
  useIsUserJoinedQuery,
  useDeleteRoomMutation,
  useEditRoomMutation,
  useGetCurrentRoomInfoQuery
} = roomApi;