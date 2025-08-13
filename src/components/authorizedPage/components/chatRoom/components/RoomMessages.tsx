import React, { useEffect, useRef } from 'react';
import styles from '../../../authorized.module.scss';
import { messageConfig, MessageProps } from '../messageConfig/MessageConfig';
import { useContextMenu } from '../../../../../hooks/useContextMenu';
import { useSocketEvents } from '../../../../../hooks/useSocketEvents';
import dayjs from 'dayjs';
import { useGetAllMessagesQuery } from '../../../../../lib/roomApi';
import { useAppDispatch, useAppSelector } from '../../../../../lib/hooks';
import { setCurrentMessageId, setMessages, setMessageUserId } from '../../../../../lib/slice';

const RoomMessages = () => {
  const {userId, currentRoomId, messages} = useAppSelector(
    state => state.auth);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {data: messageData} = useGetAllMessagesQuery(currentRoomId ? currentRoomId : '');
  const dispatch = useAppDispatch();
  
  const {
    handleContextMenu
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

    dispatch(setCurrentMessageId(messageId));
    dispatch(setMessageUserId(userId));
  };
  
  const renderMessage = (messageProps: MessageProps) => {
    return messageConfig[messageProps.type]({
      id: messageProps.id,
      createdAt: messageProps.createdAt,
      fullPath: messageProps.fullPath,
      isUpdated: messageProps.isUpdated,
      message: messageProps.message,
      roomId: Number(currentRoomId),
      updatedAt: messageProps.updatedAt,
      messageUserId: messageProps.messageUserId,
      type: messageProps.type,
      userId: Number(messageProps.userId),
      username: messageProps.username,
      scrollFn: messageProps.scrollFn,
      contextMenuFn: onContextMenu
    });
  };
  
  useEffect(() => {
    if (messageData) {
      const modifiedData = messageData.map((element: any) => ({
        ...element,
        createdAt: dayjs(element.createdAt).format('MMM D, YYYY HH:mm'),
        updatedAt: dayjs(element.updatedAt).format('MMM D, YYYY HH:mm'),
      }));
      dispatch(setMessages(modifiedData));
    }
  }, [messageData]);
  
  useSocketEvents();
  
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
    <div className={styles.authorized__chat_messageContainer} ref={messagesEndRef}>
      {
        messages.length > 0 ?
          messages.map((element: any) => (
            <div key={element._id}
              className={userId === Number(element.userId) ? styles.authorized__myMessage_wrapper :
                styles.authorized__message_wrapper}>
              <p>{element.createdAt}</p>
              {
                renderMessage({
                  id: element._id,
                  createdAt: element.createdAt,
                  fullPath: element.fullPath,
                  isUpdated: element.isUpdated,
                  message: element.message,
                  roomId: Number(currentRoomId),
                  updatedAt: element.updatedAt,
                  messageUserId: element.userId,
                  type: element.type,
                  userId: Number(element.userId),
                  username: element.username,
                  scrollFn: scrollToBottom,
                  contextMenuFn: onContextMenu
                })
              }
            </div>
          ))
          :
          <p className={'text-center mt-5 font-medium text-xl'}>This chat doesn't have any messages yet!</p>
      }
    </div>
  );
};

export default RoomMessages;