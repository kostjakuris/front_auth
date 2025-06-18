import React, { FC, RefObject, useEffect, useState } from 'react';
import styles from '../../authorizedPage/authorized.module.scss';
import Back from '../../../../public/images/Back';
import Input from '../../input/Input';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '../../../lib/hooks';
import { useGetAllMessagesQuery, useIsUserJoinedQuery, useJoinRoomMutation } from '../../../lib/roomApi';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { FadeLoader } from 'react-spinners';

interface ChatRoomProps {
  currentRoom: string;
  currentRoomId: string;
  isChat: boolean;
  closeRoomFn: () => void;
  socket: RefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null>;
}

const ChatRoom: FC<ChatRoomProps> = ({currentRoom, currentRoomId, isChat, closeRoomFn, socket}) => {
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const {userName} = useAppSelector((state) => state.auth);
  const [isJoinRoom, setIsJoinRoom] = useState(false);
  const {data: messageData, isLoading} = useGetAllMessagesQuery(currentRoomId);
  const {data: isUserJoin} = useIsUserJoinedQuery(currentRoomId);
  const [joinRoom, {data: joinData}] = useJoinRoomMutation();
  
  const submitMessage = (event: any) => {
    event.preventDefault();
    socket.current?.emit('message', {
      roomName: currentRoom,
      roomId: Number(currentRoomId),
      content: chatMessage,
      username: userName
    });
    setChatMessage('');
  };
  
  
  useEffect(() => {
    if (messageData) {
      const modifiedData = messageData.map((element: any) => ({
        ...element,
        updatedAt: new Date(element.updatedAt).toLocaleString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: false,
        }).replace('at', ''),
      }));
      setMessages(modifiedData);
    }
  }, [messageData, currentRoomId]);
  
  useEffect(() => {
    if (isUserJoin === 'true') {
      setIsJoinRoom(true);
    }
  }, [isUserJoin, currentRoomId, joinData]);
  
  useEffect(() => {
    socket.current = io('http://localhost:5000');
    socket.current?.on('getMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return (() => {
      socket.current?.off('getMessage');
    });
  }, []);
  
  return (
    <div className={!isChat ? 'hidden' : styles.authorized__chat}>
      {
        isLoading ?
          <div className={'h-50 flex items-center justify-center'}>
            <FadeLoader color={'white'} loading={true} />
          </div>
          :
          <>
            <div className={'flex justify-between items-center pl-5 my-5'}>
              <Back onClickFn={closeRoomFn} />
              <p className={`${styles.authorized__chats_title} text-center w-full pr-10`}>{currentRoom}</p>
            </div>
            {
              messages.map((element) => (
                <div key={element.keyName || element._id}
                  className={'my-5 border-1 border-white rounded-[10px]' +
                    ' pl-5 pb-5' +
                    ' w-[400px] mx-auto'}>
                  <p className={`${styles.authorized__chats_nickname}`}>{element.username}</p>
                  <p className={`${styles.authorized__chats_nickname}`}>{element.updatedAt}</p>
                  <p className={styles.authorized__text}>{element.message}</p>
                </div>
              ))
            }
            {
              isJoinRoom ?
                <form onSubmit={submitMessage} className={styles.authorized__chat_form}>
                  <Input
                    name='message'
                    placeholder='Send message'
                    type={'text'}
                    value={chatMessage}
                    onChangeFn={(event) => setChatMessage(event.target.value)}
                    class_name={styles.authorized__chat_input}
                  />
                  <button className={styles.authorized__send} type='submit'>
                    Send
                  </button>
                </form>
                :
                <div className={'flex items-center justify-center mb-5'}>
                  <button className={styles.authorized__button}
                    onClick={async() => await joinRoom(Number(currentRoomId))}>
                    Join a room
                  </button>
                </div>
            }
          </>
      }
    </div>
  );
};

export default ChatRoom;