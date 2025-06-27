'use client';
import { useEffect } from 'react';
import { getSocket } from '../api/socket';
import dayjs from 'dayjs';
import { useGetCurrentRoomInfoQuery, useIsUserJoinedQuery } from '../lib/roomApi';
import { useAppSelector } from '../lib/hooks';

export const useSocketEvents = (setMessages: (messages: any) => void) => {
  const socket = getSocket();
  const {currentRoomId} = useAppSelector(state => state.auth);
  
  const {refetch} = useGetCurrentRoomInfoQuery(currentRoomId ? currentRoomId : '');
  const {refetch: refetchIsUserJoin} = useIsUserJoinedQuery(currentRoomId ? currentRoomId : '');
  
  
  useEffect(() => {
    socket.on('getMessage', (data) => {
      setMessages((prev: any) => [...prev, {...data, createdAt: dayjs(data.createdAt).format('MMM D, YYYY HH:mm')}]);
    });
    socket.on('getUpdatedMessage', (data) => {
      setMessages((prev: any[]) =>
        prev.map(element =>
          element._id === data._id ?
            {
              ...element,
              message: data.message,
              updatedAt: dayjs(data.updatedAt).format('MMM D, YYYY HH:mm'),
              isUpdated: data.isUpdated
            } : element
        )
      );
    });
    socket.on('getDeletedId', (data) => {
      setMessages((prev: any[]) =>
        prev.filter(element =>
          element._id !== data.id
        )
      );
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
