import React, { useState } from 'react';
import styles from '../../authorized.module.scss';
import Input from '../../../input/Input';
import {
  getIsAuth,
  setChatMessage,
  setCurrentRoom,
  setCurrentRoomId,
  setIsChat,
  setIsCreateRoom,
  setIsEditMessage,
  setIsEditRoom,
  setIsRooms,
  setOwnerId
} from '../../../../lib/slice';
import { useAppDispatch, useAppSelector } from '../../../../lib/hooks';
import { useRouter } from 'next/navigation';
import { useLazyLogoutQuery } from '../../../../lib/authApi';
import { useCreateNewRoomMutation, useEditRoomMutation, useLazyGetAllRoomsQuery } from '../../../../lib/roomApi';
import { FadeLoader } from 'react-spinners';
import ChatRoom from '../chatRoom/ChatRoom';
import { getSocket } from '../../../../api/socket';
import ContextMenu from '../../../contextMenu/ContextMenu';
import { useContextMenu } from '../../../../hooks/useContextMenu';


const Chat = () => {
  const [roomName, setRoomName] = useState('');
  const dispatch = useAppDispatch();
  const {currentRoomId, userId, isCreateRoom, isEditRoom, ownerId, isChat, isRooms} = useAppSelector(
    state => state.auth);
  const router = useRouter();
  const [logout] = useLazyLogoutQuery();
  const [getAllRooms, {data, isLoading}] = useLazyGetAllRoomsQuery();
  const [createNewRoom, {isLoading: isCreateRoomLoading}] = useCreateNewRoomMutation();
  const [editRoom] = useEditRoomMutation();
  
  const connectToChat = async() => {
    await getAllRooms('');
    dispatch(setIsRooms(true));
  };
  
  const submitRoomName = async(event: any) => {
    event.preventDefault();
    if (isEditRoom) {
      await editRoom({id: Number(currentRoomId), name: roomName, ownerId: Number(ownerId)});
    } else {
      await createNewRoom({name: roomName, ownerId: Number(userId)});
    }
    setRoomName('');
    dispatch(setIsCreateRoom(false));
    dispatch(setIsEditRoom(false));
  };
  
  const logoutFn = async() => {
    await logout('');
    localStorage.setItem('isAuth', 'false');
    dispatch(getIsAuth());
    router.push('/auth');
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
  
  const {
    contextMenu,
    handleContextMenu,
    closeContextMenu,
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
    setRoomName(name);
  };
  
  
  if (isLoading || isCreateRoomLoading) {
    return (
      <div className={styles.authorized__wrapper}>
        <div className={styles.authorized}>
          <FadeLoader color={'white'} loading={true} />
        </div>
      </div>
    );
  }
  
  return (
    <div
      onClick={() => contextMenu.visible && closeContextMenu()}
      onContextMenu={() => contextMenu.visible && closeContextMenu()}>
      <div className={'flex items-center justify-between px-5'}>
        <button className={styles.authorized__button} onClick={logoutFn}>Log out</button>
        <div></div>
        <button className={styles.authorized__button} onClick={connectToChat}>
          Start new chat
        </button>
      </div>
      <div className={!isRooms ? 'hidden' : 'flex items-center justify-center flex-col mt-10'}>
        <button className={styles.authorized__button}
          onClick={() => dispatch(setIsCreateRoom(!isCreateRoom))}>
          Create new room
        </button>
        <form onSubmit={submitRoomName} className={!isCreateRoom ? 'hidden' : 'block mt-5'}>
          <Input
            name='room'
            placeholder='Room name'
            type={'text'}
            value={roomName}
            onChangeFn={(event) => setRoomName(event.target.value)}
            class_name={styles.authorized__chat_input}
          />
          <button className={styles.authorized__submit} type='submit'>
            Create
          </button>
        </form>
      </div>
      <div className={!isRooms ? 'hidden' : styles.authorized__chat_container}>
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
              <ContextMenu contextMenu={contextMenu} location={'room'} />
            </div>
            <ChatRoom />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;