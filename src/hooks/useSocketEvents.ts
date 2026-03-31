'use client';
import { useEffect } from 'react';
import { getSocket } from '../api/socket';
import dayjs from 'dayjs';
import { useGetCurrentRoomInfoQuery, useIsUserJoinedQuery } from '../lib/roomApi';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { deleteMessageById, setNewMessage, updateMessage } from '../lib/messagesSlice';
import { updateRoomLastMessage } from '../lib/roomsSlice';
import { LastMessage } from '../interfaces/form.interface';

export const useSocketEvents = () => {
  const socket = getSocket();
  const {currentRoom} = useAppSelector(state => state.rooms);
  const dispatch = useAppDispatch();
  const {refetch} = useGetCurrentRoomInfoQuery(currentRoom?.id ? String(currentRoom?.id) : '', {
    skip: !currentRoom?.id,
    refetchOnMountOrArgChange: true,
  });
  const {refetch: refetchIsUserJoin} = useIsUserJoinedQuery(currentRoom?.id ? String(currentRoom?.id) : '');

  useEffect(() => {
    socket.on('getMessage', (data) => {
      dispatch(setNewMessage({
        ...data,
        createdAt: dayjs(data.createdAt).format('MMM D, YYYY HH:mm'),
      }));
    });
    socket.on('getUpdatedMessage', (data) => {
      dispatch(updateMessage({
        _id: data._id,
        message: data.message,
        updatedAt: dayjs(data.updatedAt).format('MMM D, YYYY HH:mm'),
        isUpdated: data.isUpdated,
      }));
    });
    socket.on('getDeletedId', (data) => {
      dispatch(deleteMessageById(data.id));
      if (data.roomId) {
        dispatch(updateRoomLastMessage({ roomId: data.roomId, lastMessage: data.lastMessage ?? null }));
      }
    });
    socket.on('getKickedUser', () => {
      refetch();
      refetchIsUserJoin();
    });
    socket.on('getJoinedUser', () => {
      refetch();
      refetchIsUserJoin();
    });
    socket.on('getLastMessage', (data) => {
      if (data.roomId) {
        const lastMessage: LastMessage = {
          type: data.type,
          message: data.message,
          fileName: data.fileName,
          username: data.username,
        };
        dispatch(updateRoomLastMessage({ roomId: data.roomId, lastMessage }));
      }
    });
    return (() => {
      socket.off('getMessage');
      socket.off('getUpdatedMessage');
      socket.off('getDeletedId');
      socket.off('getKickedUser');
      socket.off('getJoinedUser');
      socket.off('getLastMessage');
    });
  }, []);
};
