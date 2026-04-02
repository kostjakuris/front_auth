'use client';
import { useEffect, useRef } from 'react';
import { getSocket } from '../api/socket';
import dayjs from 'dayjs';
import { useGetAllRoomsQuery, useGetCurrentRoomInfoQuery, useIsUserJoinedQuery } from '../lib/roomApi';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { deleteMessageById, setNewMessage, updateMessage } from '../lib/messagesSlice';
import { setRooms, updateRoomLastMessage, updateRoomList } from '../lib/roomsSlice';
import { LastMessage } from '../interfaces/form.interface';
import { useCloseRoom } from './useCloseRoom';

export const useSocketEvents = () => {
  const socket = getSocket();
  const {currentRoom} = useAppSelector(state => state.rooms);
  const {userInfo, isAuth} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const {refetch: refetchRoomData} = useGetAllRoomsQuery(undefined,
    {skip: !isAuth, refetchOnMountOrArgChange: true}
  );
  
  const {refetch} = useGetCurrentRoomInfoQuery(currentRoom?.id ? String(currentRoom?.id) : '', {
    skip: !currentRoom?.id || !!currentRoom?.username,
    refetchOnMountOrArgChange: true,
  });
  
  const {data: userData, refetch: refetchIsUserJoin} = useIsUserJoinedQuery(
    currentRoom?.id ? String(currentRoom?.id) : '');
  const {closeRoom} = useCloseRoom();
  
  const userInfoRef = useRef(userInfo);
  userInfoRef.current = userInfo;
  
  const currentRoomRef = useRef(currentRoom);
  currentRoomRef.current = currentRoom;
  
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
        dispatch(updateRoomLastMessage({roomId: data.roomId, lastMessage: data.lastMessage ?? null}));
      }
    });
    socket.on('getKickedUser', (data) => {
      if (data.userId === userInfoRef.current?.userId) {
        refetchRoomData();
        if (userData) {
          refetch();
        }
        refetchIsUserJoin();
        if (data.roomId === currentRoomRef.current?.id) {
          closeRoom();
        }
      }
    });
    socket.on('getJoinedUser', (data) => {
      if (data.userId === userInfoRef.current?.userId) {
        refetchRoomData();
      }
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
        dispatch(updateRoomLastMessage({roomId: data.roomId, lastMessage}));
      }
    });
    socket.on('getAllRooms', (data) => {
      dispatch(setRooms(data.rooms));
      if (data.roomId === currentRoomRef.current?.id && data.userId === userInfoRef.current?.userId) {
        closeRoom();
      }
    });
    socket.on('getKickedFromRoom', (data) => {
      dispatch(updateRoomList(data.roomId));
    });
    return (() => {
      socket.off('getMessage');
      socket.off('getUpdatedMessage');
      socket.off('getDeletedId');
      socket.off('getKickedUser');
      socket.off('getJoinedUser');
      socket.off('getLastMessage');
      socket.off('getAllRooms');
      socket.off('getKickedFromRoom');
    });
  }, []);
};
