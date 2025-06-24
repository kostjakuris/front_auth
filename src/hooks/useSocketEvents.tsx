'use client';
import { useEffect } from 'react';
import { getSocket } from '../api/socket';
import dayjs from 'dayjs';

export const useSocketEvents = (setMessages: (messages: any) => void) => {
  const socket = getSocket();
  
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
    return (() => {
      socket.off('getMessage');
      socket.off('getUpdatedMessage');
      socket.off('getDeletedId');
    });
  }, []);
};
