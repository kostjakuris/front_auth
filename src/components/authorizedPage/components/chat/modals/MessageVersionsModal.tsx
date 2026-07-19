'use client';
import React, { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../lib/hooks';
import { useGetAllMessageVersionsQuery } from '../../../../../lib/roomApi';
import dayjs from 'dayjs';

import styles from './modals.module.scss';
import { useModal } from '../../../../../providers/ModalProvider/ModalProvider.hooks';
import { motion } from 'framer-motion';
import { FadeLoader } from 'react-spinners';
import { messageConfig } from '../../chatRoom/messageConfig/MessageConfig';
import { scrollToBottom } from '../../../../../utils/scrollToBottom';
import ContextMenu, { ContextMenuButton } from '../../../../ui/contextMenu/ContextMenu';
import { setCurrentMessageId, setMessageUserId } from '../../../../../lib/messagesSlice';
import { useContextMenu } from '../../../../../hooks/useContextMenu';
import Git from '../../../../../../public/images/Git';
import messageStyles from '../../chatRoom/components/roomMessages.module.scss';
import ChangeMessageVersionModal from './ChangeMessageVersionModal';


const MessageVersionsModal = () => {
  const {currentMessageId} = useAppSelector(state => state.messages);
  const {data, isLoading} = useGetAllMessageVersionsQuery(currentMessageId ?? '', {
    skip: !currentMessageId,
  });
  const {messageUserId} = useAppSelector(state => state.messages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const {currentRoom} = useAppSelector(state => state.rooms);
  const {userInfo} = useAppSelector(state => state.auth);
  
  const dispatch = useAppDispatch();
  const {closeModal, openModal} = useModal();
  
  const isOwner = userInfo?.userId === Number(messageUserId);
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

  const messageButtons: ContextMenuButton[] = [
    ...(isOwner ? [{
      label: 'Make this version current',
      icon: <Git className={'mr-2 mb-0.5'} />,
      onClick: () => {
        openModal(<ChangeMessageVersionModal
          message={contextMenu.messageText}
          type={contextMenu.type}
          fullPath={contextMenu.fullPath}
          fileName={contextMenu.fileName}
          fileSize={contextMenu.fileSize}
        />);
        closeContextMenu();
      },
    }] : []),
  ];
  
  if (isLoading) {
    return (
      <div className={'w-full h-full flex items-center justify-center'}>
        <FadeLoader color={'white'} loading={true} />
      </div>
    );
  }
  
  return (
    <motion.div
      className={styles.messagesModal}
      initial={{scale: 0.7}}
      animate={{scale: 1}}
      transition={{duration: 0.4}}
    >
      <p className={'text-white text-center mb-[20px]'}>Message previous versions</p>
      <div className={`${messageStyles.message_container} !max-h-[calc(100dvh-250px)] px-[10px]!`}>
        {
          data?.map((element: any, index: number) => {
            const prev = data?.[index - 1];
            const isTheSameUser = Number(prev?.userId) === Number(element.userId);
            const isSameDay = prev ? dayjs(element.createdAt).isSame(dayjs(prev.createdAt), 'day') : false;
            return (
              <div key={element._id}>
                {!isSameDay &&
                  <p className={'text-[#67667a] py-[25px] font-normal text-center text-[14px]'}>{dayjs(
                    element.createdAt).format(
                    'dddd, MM.DD.YYYY')}</p>}
                <div
                  className={'max-w-full mt-[20px] pt-[5px]'}>
                  {
                    messageConfig[element.type as keyof typeof messageConfig]({
                      id: String(currentMessageId),
                      messages: data,
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
                      userId: Number(element.userId),
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
        }
        <div ref={bottomRef} />
        <ContextMenu
          closeContextMenu={closeContextMenu}
          contextMenu={contextMenu}
          buttons={messageButtons}
        />
      </div>
      <div className={'flex justify-around items-center mt-[20px] gap-[20px]'}>
        <button className={styles.createModal__submit} onClick={() => {
          closeModal();
          
        }}>
          Close
        </button>
      </div>
    </motion.div>
  );
};

export default MessageVersionsModal;