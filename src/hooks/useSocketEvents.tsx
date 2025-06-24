'use client';
import { useEffect } from 'react';
import { getSocket } from '../api/socket';
import {
roomApi
} from '../lib/roomApi';
import dayjs from 'dayjs';
import { useAppSelector } from '../lib/hooks';

export const useSocketEvents = (setMessages: (messages: any) => void) => {
  const socket = getSocket();
  const {currentRoomId} = useAppSelector(state => state.auth);
  
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
    // socket.on('getKickedUser', (data) => {
    //   roomApi.util.updateQueryData(
    //     'getCurrentRoomInfo',
    //     currentRoomId,
    //     (draft) => {
    //       // Merge or replace with new data
    //       Object.assign(draft, updatedRoomData)
    //     }
    //   )
    // });
    return (() => {
      socket.off('getMessage');
      socket.off('getUpdatedMessage');
      socket.off('getDeletedId');
      socket.off('getKickedUser');
    });
  }, []);
};
