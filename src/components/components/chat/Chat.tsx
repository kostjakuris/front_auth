import React, { useEffect, useState } from 'react';
import styles from '../../authorizedPage/authorized.module.scss';
import Input from '../../input/Input';
import { getIsAuth, setChatMessage, setCurrentRoom, setCurrentRoomId, setIsEditMessage } from '../../../lib/slice';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks';
import { useRouter } from 'next/navigation';
import { useLazyLogoutQuery } from '../../../lib/authApi';
import { useCreateNewRoomMutation, useLazyGetAllRoomsQuery } from '../../../lib/roomApi';
import { FadeLoader } from 'react-spinners';
import ChatRoom from '../chatRoom/ChatRoom';
import { getSocket } from '../../../api/socket';


const Chat = () => {
  const [roomName, setRoomName] = useState('');
  const [rooms, setRooms] = useState<any[]>([]);
  const [isChat, setIsChat] = useState(false);
  const [isRooms, setIsRooms] = useState(false);
  const [isCreateRoom, setIsCreateRoom] = useState(false);
  const dispatch = useAppDispatch();
  const {currentRoomId} = useAppSelector(state => state.auth);
  const router = useRouter();
  const [logout] = useLazyLogoutQuery();
  const [getAllRooms, {data, isLoading}] = useLazyGetAllRoomsQuery();
  const [createNewRoom, {isLoading: isCreateRoomLoading}] = useCreateNewRoomMutation();
  
  
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
  
  const logoutFn = async() => {
    await logout('');
    localStorage.setItem('isAuth', 'false');
    dispatch(getIsAuth());
    router.push('/auth');
  };
  
  const openRoom = async(id: number, name: string) => {
    dispatch(setCurrentRoomId(String(id)));
    dispatch(setCurrentRoom(name));
    dispatch(setIsEditMessage(false));
    dispatch(setChatMessage(''));
    const socket = getSocket();
    socket.emit('joinRoom', name);
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
    <div>
      <div className={'flex items-center justify-between px-5'}>
        <button className={styles.authorized__button} onClick={logoutFn}>Log out</button>
        <div></div>
        <button className={styles.authorized__button} onClick={connectToChat}>
          Start new chat
        </button>
      </div>
      <div className={!isRooms ? 'hidden' : 'flex items-center justify-center flex-col mt-10'}>
        <button className={styles.authorized__button}
          onClick={() => setIsCreateRoom((prev) => !prev)}>
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
                rooms.map((element: any) => (
                  <div key={element.id}
                    className={currentRoomId === String(element.id) ?
                      `${styles.authorized__chats_rooms} bg-gray-400` :
                      styles.authorized__chats_rooms}
                    onClick={() => openRoom(element.id, element.name)}>
                    <p className={`${styles.authorized__chats_title} ml-5 mt-5`}>{element.name}</p>
                  </div>
                ))
              }
            </div>
            <ChatRoom
              isChat={isChat}
              closeRoomFn={closeRoom}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;