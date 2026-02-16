'use client';
import { useEffect } from 'react';
import { getSocket } from '../api/socket';
import dayjs from 'dayjs';
import { useGetCurrentRoomInfoQuery, useIsUserJoinedQuery } from '../lib/roomApi';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { deleteMessageById, setNewMessage, updateMessage } from '../lib/slice';

export const useSocketEvents = () => {
  const socket = getSocket();
  const {currentRoomId, messages} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  
  const {refetch} = useGetCurrentRoomInfoQuery(currentRoomId ? currentRoomId : '');
  const {refetch: refetchIsUserJoin} = useIsUserJoinedQuery(currentRoomId ? currentRoomId : '');
  
  
  useEffect(() => {
    socket.on('getMessage', (data) => {
      dispatch(setNewMessage({
        ...data,
        createdAt: dayjs(data.createdAt).format('MMM D, YYYY HH:mm'),
      }));
    });
    socket.on('getUpdatedMessage', (data) => {
      console.log({data});
      dispatch(updateMessage({
        _id: data._id,
        message: data.message,
        updatedAt: dayjs(data.updatedAt).format('MMM D, YYYY HH:mm'),
        isUpdated: data.isUpdated,
      }));
    });
    socket.on('getDeletedId', (data) => {
      dispatch(deleteMessageById(data.id));
    });
    socket.on('getKickedUser', () => {
      refetch();
      refetchIsUserJoin();
    });
    socket.on('getJoinedUser', () => {
      refetch();
      refetchIsUserJoin();
    });
    return (() => {
      socket.off('getMessage');
      socket.off('getUpdatedMessage');
      socket.off('getDeletedId');
      socket.off('getKickedUser');
      socket.off('getJoinedUser');
    });
  }, []);
};
