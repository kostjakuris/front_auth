import React, { useEffect, useRef, useState } from 'react';
import styles from '../../authorized.module.scss';
import Back from '../../../../../public/images/Back';
import { useAppDispatch, useAppSelector } from '../../../../lib/hooks';
import { useGetAllMessagesQuery, useGetCurrentRoomInfoQuery, useIsUserJoinedQuery, } from '../../../../lib/roomApi';
import { FadeLoader } from 'react-spinners';
import ContextMenu from '../../../contextMenu/ContextMenu';
import SendComponent from '../../../sendComponent/SendComponent';
import Menu from '../../../../../public/images/Menu';
import { Delete } from '../../../../../public/images/Delete';
import { useSocketEvents } from '../../../../hooks/useSocketEvents';
import dayjs from 'dayjs';
import { getSocket } from '../../../../api/socket';
import { useContextMenu } from '../../../../hooks/useContextMenu';
import { setIsUsersList } from '../../../../lib/slice';
import { useCloseRoom } from '../../../../hooks/useCloseRoom';


const ChatRoom = () => {
  const [messages, setMessages] = useState<any[]>([]);
  
  const [currentMessageId, setCurrentMessageId] = useState('');
  const [isChatMenu, setIsChatMenu] = useState(false);
  const [messageUserId, setMessageUserId] = useState('');
  const {userId, currentRoom, currentRoomId, ownerId, isChat, isUsersList} = useAppSelector(
    state => state.auth);
  const {data: messageData, isLoading} = useGetAllMessagesQuery(currentRoomId ? currentRoomId : '');
  const {data: isUserJoin} = useIsUserJoinedQuery(currentRoomId ? currentRoomId : '');
  const {data: roomData} = useGetCurrentRoomInfoQuery(currentRoomId ? currentRoomId : '');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = getSocket();
  const dispatch = useAppDispatch();
  const {closeRoom} = useCloseRoom();
  
  const {
    contextMenu,
    handleContextMenu,
    closeContextMenu,
  } = useContextMenu<{
    type: string;
    fullPath: string;
    messageId: string;
    userId: string;
  }>();
  
  const onContextMenu = (
    event: any,
    message: string,
    messageId: string,
    userId: string,
    type: string,
    fullPath: string
  ) => {
    handleContextMenu(event, message, {
      type,
      fullPath,
      messageId,
      userId,
    });
    
    setCurrentMessageId(messageId);
    setMessageUserId(userId);
  };
  const handleOnClick = () => {
    if (contextMenu.visible) {
      closeContextMenu();
    }
    if (isChatMenu) {
      setIsChatMenu(false);
    }
  };
  
  const openUsersList = (event: any) => {
    event.stopPropagation();
    dispatch(setIsUsersList(true));
    setIsChatMenu(false);
  };
  
  useEffect(() => {
    if (messageData) {
      const modifiedData = messageData.map((element: any) => ({
        ...element,
        createdAt: dayjs(element.createdAt).format('MMM D, YYYY HH:mm'),
        updatedAt: dayjs(element.updatedAt).format('MMM D, YYYY HH:mm'),
      }));
      setMessages(modifiedData);
    }
  }, [messageData]);
  
  useSocketEvents(setMessages);
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  return (
    <div
      onClick={handleOnClick}
      onContextMenu={() => contextMenu.visible && closeContextMenu()}
      className={!isChat ? 'hidden' : styles.authorized__chat}>
      {
        isLoading ?
          <div className={'h-50 flex items-center justify-center'}>
            <FadeLoader color={'white'} loading={true} />
          </div>
          :
          <>
            <div className={'flex justify-between items-center pl-5 my-5'}>
              <Back onClickFn={closeRoom} />
              <p className={`${styles.authorized__chats_title} text-center w-full pr-10`}>{currentRoom}</p>
              <div className={'relative'}>
                <button className={'mr-3 cursor-pointer'}
                  onClick={() => setIsChatMenu((prev) => !prev)}>
                  <Menu />
                </button>
                <div className={!isChatMenu ? 'hidden' : styles.authorized__chat_ownerMenu}>
                  <button
                    onClick={(event) => openUsersList(event)}
                    className={styles.authorized__chat_btn}>
                    All users
                  </button>
                </div>
              </div>
            </div>
            {
              isUsersList ?
                <div className={styles.authorized__chat_userList}>
                  <p className={`${styles.authorized__chats_title} my-5 text-center`}>All users</p>
                  {
                    roomData?.users?.map((user: any) => (
                      <div key={user.id} className={'flex items-center justify-between h-[60px]'}>
                        <p className={`${styles.authorized__chats_title} ml-5`}>{userId !== user.id ? user.username :
                          `Me(${user.username})`}</p>
                        {
                          userId === ownerId && userId !== user.id ?
                            <button className={'cursor-pointer h-10'}
                              onClick={() => socket.emit('kickUserFromRoom',
                                {roomName: currentRoom, roomId: currentRoomId, userId: user.id}
                              )}>
                              <Delete />
                            </button>
                            : null
                        }
                      </div>
                    ))
                  }
                </div>
                :
                <div className={styles.authorized__chat_messageContainer} ref={messagesEndRef}>
                  {
                    messages.length > 0 ?
                      messages.map((element: any) => (
                        <div key={element._id}
                          className={userId === Number(element.userId) ? styles.authorized__myMessage_wrapper :
                            styles.authorized__message_wrapper}>
                          <p>{element.createdAt}</p>
                          {
                            element.type === 'image' ?
                              <div
                                onContextMenu={(event) => onContextMenu(event, element.message,
                                  element._id,
                                  element.userId, element.type, element.fullPath
                                )}
                              >
                                <img onLoad={scrollToBottom} className={'max-w-[400px]' +
                                  ' max-h-[400px]' +
                                  ' w-full h-full'} src={element.message}
                                  alt={element.message} />
                              </div>
                              :
                              <div
                                onContextMenu={(event) => onContextMenu(event, element.message,
                                  element._id,
                                  element.userId, element.type, element.fullPath
                                )}
                                className={userId === Number(element.userId) ?
                                  styles.authorized__chat_myMessage : styles.authorized__chat_message}
                              >
                                <p className={`${styles.authorized__chats_nickname}
                              ${userId === Number(element.userId) ? 'text-yellow-300' : 'text-green-400'}`}>
                                  {element.username}
                                </p>
                                <p className={styles.authorized__text}>{element.message}</p>
                                {
                                  element.updatedAt && element.isUpdated ?
                                    <p className={'mt-2 text-gray-300'}>updated at: {element.updatedAt}</p>
                                    : null
                                }
                              </div>
                          }
                        </div>
                      ))
                      :
                      <p className={'text-center mt-5 font-medium text-xl'}>This chat doesn't have any messages yet!</p>
                  }
                </div>
            }
            <ContextMenu
              contextMenu={contextMenu}
              messageId={currentMessageId}
              messageUserId={messageUserId}
              location={'message'}
            />
            {
              !isUsersList ?
                isUserJoin === 'true' ?
                  <SendComponent
                    messages={messages}
                    messageId={currentMessageId}
                    messageUserId={messageUserId}
                  />
                  :
                  <div className={'flex items-center justify-center mb-5'}>
                    <button className={styles.authorized__button}
                      onClick={() => socket.emit('joinRoom', {
                        roomName: currentRoom,
                        roomId: currentRoomId,
                        userId
                      })}>
                      Join a room
                    </button>
                  </div>
                : null
            }
          </>
      }
    </div>
  );
};

export default ChatRoom;