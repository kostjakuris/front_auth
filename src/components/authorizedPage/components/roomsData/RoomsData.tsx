'use client';
import React from 'react';
import styles from '../../authorized.module.scss';
import { ContextMenu } from '../../../ui/contextMenu';
import { Chat, ChatRoom } from '../../index';
import { useAppDispatch, useAppSelector } from '../../../../lib/hooks';
import {
  setChatMessage,
  setCurrentRoom,
  setCurrentRoomId,
  setIsChat,
  setIsEditMessage,
  setIsEditRoom,
  setOwnerId,
  setRoomName
} from '../../../../lib/slice';
import { useContextMenu } from '../../../../hooks/useContextMenu';
import { getSocket } from '../../../../api/socket';
import { useGetAllRoomsQuery } from '../../../../lib/roomApi';


const RoomsData = () => {
  const dispatch = useAppDispatch();
  const {currentRoomId, userId} = useAppSelector(
    state => state.auth);
  const {data} = useGetAllRoomsQuery('');
  
  const {
    contextMenu,
    handleContextMenu,
    closeContextMenu
  } = useContextMenu();
  const onRoomContextMenu = (
    event: any,
    roomId: number,
    name: string,
    ownerId: number
  ) => {
    handleContextMenu(event, name);
    
    dispatch(setCurrentRoomId(String(roomId)));
    dispatch(setOwnerId(ownerId));
    dispatch(setIsEditRoom(true));
    dispatch(setRoomName(name));
  };
  
  const openRoom = (id: number, name: string, ownerId: number) => {
    dispatch(setCurrentRoomId(String(id)));
    dispatch(setCurrentRoom(name));
    dispatch(setOwnerId(ownerId));
    dispatch(setIsEditMessage(false));
    dispatch(setChatMessage(''));
    const socket = getSocket();
    socket.emit('joinRoom', {
      roomName: name,
      roomId: id,
      userId
    });
    dispatch(setIsChat(true));
  };
  
  return (
    <div
      onClick={() => contextMenu.visible && closeContextMenu()}
      onContextMenu={() => contextMenu.visible && closeContextMenu()}
      className={styles.authorized__chat_container}>
      <div className={styles.authorized__chat_wrapper}>
        <div className={'flex justify-between'}>
          <div className={'flex flex-col items-center'}>
            {
              data?.map((element: any) => (
                <div key={element.id}
                  onContextMenu={(event) => onRoomContextMenu(event, element.id, element.name, element.ownerId)}
                  className={currentRoomId === String(element.id) ?
                    `${styles.authorized__chats_rooms} bg-gray-400` : styles.authorized__chats_rooms}
                  onClick={() => openRoom(element.id, element.name, element.ownerId)}>
                  <p className={`${styles.authorized__chats_title} ml-5 mt-5`}>{element.name}</p>
                </div>
              ))
            }
            <ContextMenu contextMenu={contextMenu} location={'room'} closeContextMenu={closeContextMenu} />
          </div>
          <ChatRoom />
        </div>
      </div>
    </div>
  );
};

export default RoomsData;