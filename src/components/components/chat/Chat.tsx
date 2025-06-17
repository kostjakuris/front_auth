import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import styles from '../../authorizedPage/authorized.module.scss';
import Input from '../../input/Input';
import { getIsAuth } from '../../../lib/slice';
import { useAppDispatch } from '../../../lib/hooks';
import { useRouter } from 'next/navigation';
import { useLazyLogoutQuery } from '../../../lib/authApi';
import { useCreateNewRoomMutation, useJoinRoomMutation, useLazyGetAllRoomsQuery } from '../../../lib/roomApi';
import { FadeLoader } from 'react-spinners';
import ChatRoom from '../chatRoom/ChatRoom';


const Chat = () => {
  const [roomName, setRoomName] = useState('');
  const [existingRoomName, setExistingRoomName] = useState('');
  const [rooms, setRooms] = useState<any[]>([]);
  const [isChat, setIsChat] = useState(false);
  const [isRooms, setIsRooms] = useState(false);
  const [isCreateRoom, setIsCreateRoom] = useState(false);
  const [isJoinRoom, setIsJoinRoom] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('');
  const [currentRoomId, setCurrentRoomId] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logout] = useLazyLogoutQuery();
  const [getAllRooms, {data, isLoading}] = useLazyGetAllRoomsQuery();
  const [createNewRoom, {isLoading: isCreateRoomLoading}] = useCreateNewRoomMutation();
  const [joinRoom, {isLoading: isJoinRoomLoading}] = useJoinRoomMutation();
  const socket = useRef<Socket>(null);
  
  const connectToChat = async() => {
    await getAllRooms('');
    setIsRooms(true);
  };
  
  const submitRoomName = async(event: any) => {
    event.preventDefault();
    await createNewRoom(roomName);
    setRoomName('');
    setIsCreateRoom(false);
  };
  
  const joinNewRoom = async(event: any) => {
    event.preventDefault();
    await joinRoom(existingRoomName);
    setExistingRoomName('');
    setIsJoinRoom(false);
  };
  
  
  const logoutFn = async() => {
    await logout('');
    localStorage.setItem('isAuth', 'false');
    dispatch(getIsAuth());
    router.push('/auth');
  };
  
  const openRoom = async(id: number, name: string) => {
    setCurrentRoomId(String(id));
    setCurrentRoom(name);
    socket.current = io('http://localhost:5000');
    socket.current?.emit('joinRoom', name);
    setIsRooms(false);
    setIsChat(true);
  };
  
  const closeRoom = () => {
    setIsRooms(true);
    setIsChat(false);
  };
  
  useEffect(() => {
    if (data) {
      setRooms(data);
    }
  }, [data]);
  
  
  if (isLoading || isCreateRoomLoading || isJoinRoomLoading) {
    return (
      <div className={styles.authorized__wrapper}>
        <div className={styles.authorized}>
          <FadeLoader color={'white'} loading={true} />
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className={'flex items-center justify-between px-5'}>
        <button className={styles.authorized__button} onClick={logoutFn}>Log out</button>
        <div></div>
        <button className={styles.authorized__button} onClick={connectToChat}>
          Start new chat
        </button>
      </div>
      <div className={!isRooms ? 'hidden' : styles.authorized__chats}>
        <div className={'flex items-center justify-between mt-10'}>
          <button className={`${styles.authorized__button} mr-5`}
            onClick={() => setIsCreateRoom((prev) => !prev)}>
            Create new room
          </button>
          <button className={styles.authorized__button}
            onClick={() => setIsJoinRoom((prev) => !prev)}>
            Join a room
          </button>
        </div>
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
        <form onSubmit={joinNewRoom} className={!isJoinRoom ? 'hidden' : 'block mt-5'}>
          <Input
            name='room'
            placeholder='Room name'
            type={'text'}
            value={existingRoomName}
            onChangeFn={(event) => setExistingRoomName(event.target.value)}
            class_name={styles.authorized__chat_input}
          />
          <button className={styles.authorized__submit} type='submit'>
            Join
          </button>
        </form>
        <p className={`${styles.authorized__chats_title} mt-5`}>All chats</p>
        {
          rooms.map((element: any) => (
            <div key={element.id} className={!isRooms ? 'hidden' : styles.authorized__chats_rooms}
              onClick={() => openRoom(element.id, element.name)}>
              <p className={styles.authorized__chats_title}>{element.name}</p>
            </div>
          ))
        }
      </div>
      <ChatRoom
        currentRoom={currentRoom}
        currentRoomId={currentRoomId}
        isChat={isChat}
        closeRoomFn={closeRoom}
        socket={socket}
      />
    </div>
  );
};

export default Chat;