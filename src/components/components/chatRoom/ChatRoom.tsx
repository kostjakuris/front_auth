import React, { FC, useEffect, useRef, useState } from 'react';
import styles from '../../authorizedPage/authorized.module.scss';
import Back from '../../../../public/images/Back';
import { useAppSelector } from '../../../lib/hooks';
import { useGetAllMessagesQuery, useIsUserJoinedQuery, useJoinRoomMutation } from '../../../lib/roomApi';
import { FadeLoader } from 'react-spinners';
import ContextMenu from '../../contextMenu/ContextMenu';
import SendComponent from '../../sendComponent/SendComponent';
import { getSocket } from '../../../api/socket';

interface ChatRoomProps {
  isChat: boolean;
  closeRoomFn: () => void;
}

const ChatRoom: FC<ChatRoomProps> = ({isChat, closeRoomFn}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isJoinRoom, setIsJoinRoom] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    messageText: '',
  });
  const [currentMessageId, setCurrentMessageId] = useState('');
  const {userId, currentRoom, currentRoomId} = useAppSelector(state => state.auth);
  const {data: messageData, isLoading} = useGetAllMessagesQuery(currentRoomId ? currentRoomId : '');
  const {data: isUserJoin} = useIsUserJoinedQuery(currentRoomId ? currentRoomId : '');
  const [joinRoom, {data: joinData}] = useJoinRoomMutation();
  const socket = getSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleContextMenu = (event: any, message: string, messageId: string) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      visible: true,
      x: event.pageX,
      y: event.pageY,
      messageText: message,
    });
    setCurrentMessageId(messageId);
  };
  
  useEffect(() => {
    if (messageData) {
      const modifiedData = messageData.map((element: any) => ({
        ...element,
        createdAt: new Date(element.createdAt).toLocaleString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: false,
        }).replace('at', ''),
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
    socket.on('getMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });
    socket.on('getUpdatedMessage', (data) => {
      setMessages(prev =>
        prev.map(element =>
          element._id === data._id ? {...element, message: data.message, updatedAt: data.updatedAt} : element
        )
      );
    });
    socket.on('getDeletedId', (data) => {
      setMessages(prev =>
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
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({top: messagesEndRef.current.scrollHeight});
    }
  }, [currentRoomId, messages]);
  
  return (
    <div
      onClick={() => contextMenu.visible &&
        setContextMenu({visible: false, x: 0, y: 0, messageText: ''})}
      onContextMenu={() => contextMenu.visible &&
        setContextMenu({visible: false, x: 0, y: 0, messageText: ''})}
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
            <div className={styles.authorized__chat_messageContainer} ref={messagesEndRef}>
              {
                messages.length > 0 ?
                  messages.map((element) => (
                    <div key={element._id}
                      className={userId === Number(element.userId) ? styles.authorized__myMessage_wrapper :
                        styles.authorized__message_wrapper}>
                      <p>{element.createdAt}</p>
                      <div
                        onContextMenu={(event) => handleContextMenu(event, element.message, element._id)}
                        className={userId === Number(element.userId) ?
                          styles.authorized__chat_myMessage : styles.authorized__chat_message}>
                        <p className={`${styles.authorized__chats_nickname}
                    ${userId === Number(element.userId) ? 'text-yellow-300' : 'text-green-400'}`}>
                          {element.username}
                        </p>
                        <p className={styles.authorized__text}>{element.message}</p>
                        {
                          element.updatedAt ?
                            <p className={'mt-2 text-gray-300'}>updated at: {element.updatedAt}</p>
                            : null
                        }
                      </div>
                    </div>
                  ))
                  :
                  <p className={'text-center mt-5 font-medium text-xl'}>This chat doesn't have any messages yet!</p>
              }
            </div>
            <ContextMenu contextMenu={contextMenu} messageId={currentMessageId} />
            {
              isJoinRoom ?
                <SendComponent messages={messages} messageId={currentMessageId} />
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