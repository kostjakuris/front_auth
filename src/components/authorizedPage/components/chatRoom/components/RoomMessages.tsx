'use client';
import React, { useEffect, useRef } from 'react';
import styles from './roomMessages.module.scss';
import { messageConfig } from '../messageConfig/MessageConfig';
import { useContextMenu } from '../../../../../hooks/useContextMenu';
import dayjs from 'dayjs';
import { useGetAllMessagesQuery } from '../../../../../lib/roomApi';
import { useAppDispatch, useAppSelector } from '../../../../../lib/hooks';
import {
  setChatMessage,
  setCurrentMessageId,
  setIsEditMessage,
  setIsReplaceMessage,
  setMessages,
  setMessageUserId
} from '../../../../../lib/messagesSlice';
import ContextMenu, { ContextMenuButton } from '../../../../ui/contextMenu/ContextMenu';
import { useModal } from '../../../../../providers/ModalProvider/ModalProvider.hooks';
import { DeleteMessageModal } from '../../../index';
import { Edit } from '../../../../../../public/images/Edit';
import { Delete } from '../../../../../../public/images/Delete';
import Copy from '../../../../../../public/images/Copy';
import Git from '../../../../../../public/images/Git';
import { scrollToBottom } from '../../../../../utils/scrollToBottom';
import MessageVersionsModal from '../../chat/modals/MessageVersionsModal';

const RoomMessages = () => {
  const {userInfo} = useAppSelector(state => state.auth);
  const {currentRoom} = useAppSelector(state => state.rooms);
  const {messages, messageUserId} = useAppSelector(state => state.messages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const {data: messageData} = useGetAllMessagesQuery(currentRoom?.id ? String(currentRoom?.id) : '', {
    skip: !currentRoom?.id,
    refetchOnMountOrArgChange: true
  });
  const dispatch = useAppDispatch();
  const {openModal} = useModal();
  
  const {handleContextMenu, contextMenu, closeContextMenu} = useContextMenu<{
    type: string;
    fullPath: string;
    messageId: string;
    userId: string;
    isUpdated: boolean;
    fileName: string;
    fileSize: string;
  }>();
  
  const onContextMenu = (
    event: any,
    message: string,
    messageId: string,
    userId: string,
    type: string,
    fullPath: string,
    fileName: string,
    fileSize: string,
    isUpdated: boolean
  ) => {
    handleContextMenu(event, message, {
      type,
      fullPath,
      messageId,
      userId,
      isUpdated,
      fileName,
      fileSize,
    });
    
    dispatch(setCurrentMessageId(messageId));
    dispatch(setMessageUserId(userId));
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
  
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (messages.length === 0) return;
    scrollToBottom(scrollTimeoutRef, bottomRef);
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
    ...(isOwner && contextMenu.type !== 'text' ? [{
      label: 'Replace',
      icon: <Edit className={'w-[20px] h-[20px] mr-2 mb-0.5'} />,
      onClick: () => {
        dispatch(setIsReplaceMessage(true));
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
    ...(contextMenu.isUpdated ? [{
      label: 'Previous versions',
      icon: <Git className={'mr-2 mb-0.5'} />,
      onClick: () => {
        openModal(<MessageVersionsModal />);
        closeContextMenu();
      },
    }] : []),
  ];
  console.log({messages});
  
  return (
    <div className={styles.message_container}>
      {
        messages.length > 0 ?
          messages.map((element: any, index: number) => {
            const prev = messages[index - 1];
            const isTheSameUser = Number(prev?.userId) === Number(element.userId);
            const isSameDay = prev ? dayjs(element.createdAt).isSame(dayjs(prev.createdAt), 'day') : false;
            const isMyMessage = userInfo?.userId === Number(element.userId);
            return (
              <div key={element._id}>
                {!isSameDay &&
                  <p className={'text-[#67667a] py-[50px] font-normal text-center text-[14px]'}>{dayjs(
                    element.createdAt).format(
                    'dddd, MM.DD.YYYY')}</p>}
                <div
                  className={`${isMyMessage ? styles.my_message_wrapper : styles.message_wrapper} ${isMyMessage &&
                  !isTheSameUser ? 'mt-[45px]!' : 'my-0!'}`}>
                  {
                    messageConfig[element.type as keyof typeof messageConfig]({
                      id: element._id,
                      messages,
                      roomType: currentRoom?.type,
                      createdAt: element.createdAt,
                      fullPath: element.fullPath,
                      isUpdated: element.isUpdated,
                      message: element.message,
                      fileName: element.fileName,
                      fileSize: element.fileSize,
                      roomId: Number(currentRoom?.id),
                      updatedAt: element.updatedAt,
                      messageUserId: element.userId,
                      timeOutRef: scrollTimeoutRef,
                      elementRef: bottomRef,
                      type: element.type,
                      userId: Number(userInfo?.userId),
                      username: element.username,
                      scrollFn: scrollToBottom,
                      contextMenuFn: onContextMenu,
                      isTheSameUser,
                    })
                  }
                </div>
              </div>
            );
          })
          :
          <div className={'h-full flex items-center justify-center flex-1'}>
            <p className={'text-center text-[16px] text-white mt-5 font-medium text-xl'}>This chat doesn't have any
              messages
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
