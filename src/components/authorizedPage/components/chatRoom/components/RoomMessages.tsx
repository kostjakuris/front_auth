'use client';
import React, { useEffect, useRef } from 'react';
import styles from '../../../authorized.module.scss';
import { messageConfig, MessageProps } from '../messageConfig/MessageConfig';
import { useContextMenu } from '../../../../../hooks/useContextMenu';
import { useSocketEvents } from '../../../../../hooks/useSocketEvents';
import dayjs from 'dayjs';
import { useGetAllMessagesQuery } from '../../../../../lib/roomApi';
import { useAppDispatch, useAppSelector } from '../../../../../lib/hooks';
import {
  setChatMessage,
  setCurrentMessageId,
  setIsEditMessage,
  setMessages,
  setMessageUserId
} from '../../../../../lib/slice';
import ContextMenu, { ContextMenuButton } from '../../../../ui/contextMenu/ContextMenu';
import { useModal } from '../../../../../providers/ModalProvider/ModalProvider.hooks';
import { DeleteMessageModal } from '../../../index';
import { Edit } from '../../../../../../public/images/Edit';
import { Delete } from '../../../../../../public/images/Delete';
import Copy from '../../../../../../public/images/Copy';

const RoomMessages = () => {
  const {userInfo, currentRoomId, messages, messageUserId} = useAppSelector(
    state => state.auth);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const {data: messageData} = useGetAllMessagesQuery(currentRoomId ? currentRoomId : '');
  const dispatch = useAppDispatch();
  const {openModal} = useModal();
  
  const {handleContextMenu, contextMenu, closeContextMenu} = useContextMenu<{
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
      userId: Number(userInfo?.userId),
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
  
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const scrollToBottom = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, 100);
  };
  
  useEffect(() => {
    if (messages.length === 0) return;
    scrollToBottom();
  }, [messages]);
  
  const isOwner = userInfo?.userId === Number(messageUserId);
  
  const messageButtons: ContextMenuButton[] = [
    ...(isOwner && contextMenu.type === 'text' ? [{
      label: 'Edit',
      icon: <Edit className={'w-[20px] h-[20px] mr-2 mb-0.5'} />,
      onClick: () => {
        dispatch(setChatMessage(contextMenu.messageText));
        dispatch(setIsEditMessage(true));
        closeContextMenu();
      },
    }] : []),
    ...(isOwner ? [{
      label: 'Delete',
      icon: <Delete className={'w-[20px] h-[20px] mr-2 mb-0.5'} />,
      onClick: () => {
        openModal(<DeleteMessageModal location='message' contextMenu={contextMenu} />);
        closeContextMenu();
      },
    }] : []),
    ...(contextMenu.type === 'text' ? [{
      label: 'Copy text',
      icon: <Copy className={'mr-2 mb-0.5'} />,
      onClick: () => {
        navigator.clipboard.writeText(contextMenu.messageText);
        closeContextMenu();
      },
    }] : []),
  ];
  
  return (
    <div className={styles.authorized__chat_messageContainer} ref={messagesEndRef}>
      {
        messages.length > 0 ?
          messages.map((element: any) => (
            <div key={element._id}
              className={userInfo?.userId === Number(element.userId) ? styles.authorized__myMessage_wrapper :
                styles.authorized__message_wrapper}>
              <p className={'text-white'}>{element.createdAt}</p>
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
          <div className={'h-full flex items-center justify-center flex-1'}>
            <p className={'text-center text-white mt-5 font-medium text-xl'}>This chat doesn't have any messages
              yet!</p>
          </div>
      }
      <div ref={bottomRef} />
      <ContextMenu
        closeContextMenu={closeContextMenu}
        contextMenu={contextMenu}
        buttons={messageButtons}
      />
    </div>
  );
};

export default RoomMessages;
