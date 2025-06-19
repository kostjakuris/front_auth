import React, { FC, RefObject, useEffect, useState } from 'react';
import styles from '../../authorizedPage/authorized.module.scss';
import Back from '../../../../public/images/Back';
import Input from '../../input/Input';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '../../../lib/hooks';
import {
  useDeleteMessageMutation,
  useGetAllMessagesQuery,
  useIsUserJoinedQuery,
  useJoinRoomMutation
} from '../../../lib/roomApi';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { FadeLoader } from 'react-spinners';
import Send from '../../../../public/images/Send';
import { Edit } from '../../../../public/images/Edit';
import { Delete } from '../../../../public/images/Delete';
import Copy from '../../../../public/images/Copy';

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
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    messageText: '',
    messageId: ''
  });
  const {data: messageData, isLoading} = useGetAllMessagesQuery(currentRoomId);
  const {data: isUserJoin} = useIsUserJoinedQuery(currentRoomId);
  const [joinRoom, {data: joinData}] = useJoinRoomMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const {userId} = useAppSelector(state => state.auth);
  
  const submitMessage = (event: any) => {
    event.preventDefault();
    socket.current?.emit('message', {
      userId,
      roomName: currentRoom,
      roomId: Number(currentRoomId),
      content: chatMessage,
      username: userName,
      updatedAt: new Date().toLocaleString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
      }).replace('at', '')
    });
    setChatMessage('');
  };
  
  const editMessage = () => {
    setChatMessage(contextMenu.messageText);
  };
  
  const handleContextMenu = (event: any, message: string, messageId: string) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      visible: true,
      x: event.pageX,
      y: event.pageY,
      messageText: message,
      messageId
    });
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
    <div
      onClick={() => contextMenu.visible &&
        setContextMenu({visible: false, x: 0, y: 0, messageText: '', messageId: ''})}
      onContextMenu={() => contextMenu.visible &&
        setContextMenu({visible: false, x: 0, y: 0, messageText: '', messageId: ''})}
      className={!isChat ? 'hidden' : styles.authorized__chat}>
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
                <div key={element._id}
                  className={userId === Number(element.userId) ? styles.authorized__myMessage_wrapper :
                    styles.authorized__message_wrapper}>
                  <p className={`${styles.authorized__chats_date}`}>{element.updatedAt}</p>
                  <div
                    onContextMenu={(event) => handleContextMenu(event, element.message, element._id)}
                    className={userId === Number(element.userId) ?
                      styles.authorized__chat_myMessage : styles.authorized__chat_message}>
                    <p className={`${styles.authorized__chats_nickname}
                    ${userId === Number(element.userId) ? 'text-yellow-300' : 'text-green-400'}`}>
                      {element.username}
                    </p>
                    <p className={styles.authorized__text}>{element.message}</p>
                  </div>
                </div>
              ))
            }
            <div
              className={!contextMenu.visible ? 'hidden' : styles.authorized__chat_menu}
              style={{
                position: 'absolute',
                top: contextMenu.y,
                left: contextMenu.x,
              }}>
              <button onClick={editMessage} className={styles.authorized__chat_btn}>
                <Edit class_name={'w-[20px] h-[20px] mr-2 mb-0.5'} />
                Edit
              </button>
              <button
                onClick={async() => await deleteMessage(contextMenu.messageId)}
                className={styles.authorized__chat_btn}>
                <Delete class_name={'w-[20px] h-[20px] mr-2 mb-0.5'} />
                Delete
              </button>
              <button onClick={() => navigator.clipboard.writeText(contextMenu.messageText)}
                className={styles.authorized__chat_btn}>
                <Copy class_name={'mr-2 mb-0.5'} />
                Copy text
              </button>
            </div>
            {
              isJoinRoom ?
                <form onSubmit={submitMessage}
                  className={`${styles.authorized__chat_form} ${messages.length === 0 ? 'mt-auto' : 'mt-5'}`}>
                  <Input
                    name='message'
                    placeholder='Send message'
                    type={'text'}
                    value={chatMessage}
                    onChangeFn={(event) => setChatMessage(event.target.value)}
                    class_name={styles.authorized__chat_input}
                  />
                  <button
                    disabled={chatMessage.length === 0}
                    className={styles.authorized__send}
                    type='submit'>
                    <Send />
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