import React, { FC, useEffect, useRef, useState } from 'react';
import styles from '../../authorizedPage/authorized.module.scss';
import Back from '../../../../public/images/Back';
import { useAppSelector } from '../../../lib/hooks';
import {
  useGetAllMessagesQuery,
  useGetCurrentRoomInfoQuery,
  useIsUserJoinedQuery,
  useJoinRoomMutation
} from '../../../lib/roomApi';
import { FadeLoader } from 'react-spinners';
import ContextMenu from '../../contextMenu/ContextMenu';
import SendComponent from '../../sendComponent/SendComponent';
import Menu from '../../../../public/images/Menu';
import { Delete } from '../../../../public/images/Delete';

interface ChatRoomProps {
  isChat: boolean;
  setIsChat: (isChat: boolean) => void;
  setIsRooms: (isRoom: boolean) => void;
}

const ChatRoom: FC<ChatRoomProps> = ({isChat, setIsChat, setIsRooms}) => {
  // const [messages, setMessages] = useState<any[]>([]);
  
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    messageText: '',
  });
  const [currentMessageId, setCurrentMessageId] = useState('');
  const [isChatMenu, setIsChatMenu] = useState(false);
  const [isUsersList, setIsUsersList] = useState(false);
  const [messageUserId, setMessageUserId] = useState('');
  const {userId, currentRoom, currentRoomId, ownerId} = useAppSelector(state => state.auth);
  const {data: messageData, isLoading} = useGetAllMessagesQuery(currentRoomId ? currentRoomId : '');
  const messages = messageData?.map((element: any) => ({
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
  })) || [];
  const {data: isUserJoin} = useIsUserJoinedQuery(currentRoomId ? currentRoomId : '');
  const isJoinRoom = isUserJoin === 'true';
  const {data: roomData} = useGetCurrentRoomInfoQuery(currentRoomId ? currentRoomId : '');
  const [joinRoom] = useJoinRoomMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleContextMenu = (event: any, message: string, messageId: string, userId: string) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      visible: true,
      x: event.pageX,
      y: event.pageY,
      messageText: message,
    });
    setCurrentMessageId(messageId);
    setMessageUserId(userId);
  };
  
  const handleOnClick = () => {
    if (contextMenu.visible) {
      setContextMenu({visible: false, x: 0, y: 0, messageText: ''});
    }
    if (isChatMenu) {
      setIsChatMenu(false);
    }
  };
  
  const closeRoom = () => {
    if (isUsersList) {
      setIsUsersList(false);
    } else {
      setIsRooms(true);
      setIsChat(false);
    }
  };
  
  const openUsersList = (event: any) => {
    event.stopPropagation();
    setIsUsersList(true);
    setIsChatMenu(false);
  };
  
  // useSocketEvents(setMessages);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({top: messagesEndRef.current.scrollHeight});
    }
  }, [currentRoomId, messages, isUsersList]);
  
  
  return (
    <div
      onClick={handleOnClick}
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
                        <p className={`${styles.authorized__chats_title} ml-5`}>{user.username}</p>
                        {
                          userId === ownerId ?
                            <button className={'cursor-pointer h-10'}>
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
                          <div
                            onContextMenu={(event) => handleContextMenu(event, element.message, element._id,
                              element.userId
                            )}
                            className={userId === Number(element.userId) ?
                              styles.authorized__chat_myMessage : styles.authorized__chat_message}>
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
              isJoinRoom ?
                <SendComponent messages={messages} messageId={currentMessageId} messageUserId={messageUserId} />
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