import React, { FC, RefObject, useEffect, useState } from 'react';
import styles from '../../authorizedPage/authorized.module.scss';
import Back from '../../../../public/images/Back';
import Input from '../../input/Input';
import { Socket } from 'socket.io-client';
import { useAppSelector } from '../../../lib/hooks';
import { useGetAllMessagesQuery } from '../../../lib/roomApi';
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
  const {data: messageData, isLoading} = useGetAllMessagesQuery(currentRoomId);
  
  const submitMessage = (event: any) => {
    event.preventDefault();
    socket.current?.on('getMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });
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
      setMessages(messageData);
    }
  }, [messageData, currentRoomId]);
  
  useEffect(() => {
    socket.current?.off('getMessage');
  }, [messages]);
  
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
              <p className={`${styles.authorized__chats_title} text-center w-full`}>{currentRoom}</p>
            </div>
            {
              messages.map((element) => (
                <div key={element.keyName || element._id}
                  className={'my-5 border-1 border-white rounded-[10px]' +
                    ' pl-5 pb-5' +
                    ' w-[400px] mx-auto'}>
                  <p className={`${styles.authorized__chats_nickname}`}>{element.username}</p>
                  <p className={styles.authorized__text}>{element.message}</p>
                </div>
              ))
            }
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
          </>
      }
    </div>
  );
};

export default ChatRoom;