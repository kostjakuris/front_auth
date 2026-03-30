import { createApi } from '@reduxjs/toolkit/query/react';
import { CreateRoomFields, DeleteRoomFields, EditRoomFields, Room } from '../interfaces/form.interface';
import { baseQueryWithReauth } from './baseQueryWithReauth';

export const roomApi = createApi({
  reducerPath: 'roomApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Room'],
  endpoints: (build) => ({
    getAllRooms: build.query<Room[], void>({
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
    isUserJoined: build.query({
      query: (id: string) => ({
        url: `/room/check?id=${id}`,
        responseHandler: 'text'
      }),
      providesTags: ['Room']
    }),
    searchRooms: build.query<Room[], string>({
      query: (q) => ({
        url: `/room/search?q=${encodeURIComponent(q)}`,
      }),
      providesTags: ['Room'],
    }),
  }),
});

export const {
  useGetAllRoomsQuery,
  useCreateNewRoomMutation,
  useGetAllMessagesQuery,
  useIsUserJoinedQuery,
  useDeleteRoomMutation,
  useEditRoomMutation,
  useGetCurrentRoomInfoQuery,
  useSearchRoomsQuery
} = roomApi;