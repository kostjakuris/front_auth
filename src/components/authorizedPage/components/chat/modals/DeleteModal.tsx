'use client';
import React, { FC } from 'react';
import styles from './modals.module.scss';
import { useModal } from '../../../../../providers/ModalProvider/ModalProvider.hooks';
import { deleteObject, listAll, ref } from '@firebase/storage';
import { storage } from '../../../../../firebase';
import { useDeleteRoomMutation } from '../../../../../lib/roomApi';
import { getSocket } from '../../../../../api/socket';
import { useAppSelector } from '../../../../../lib/hooks';
import { useCloseRoom } from '../../../../../hooks/useCloseRoom';
import { motion } from 'framer-motion';

interface DeleteModalProps {
  location: 'room' | 'message';
  contextMenu: {messageText: string; type?: string; fullPath?: string};
}

const DeleteModal: FC<DeleteModalProps> = ({contextMenu, location}) => {
  const {closeModal} = useModal();
  const [deleteRoom] = useDeleteRoomMutation();
  const {
    currentRoom,
    chosenRoom,
    chosenOwnerId,
    currentRoomId,
    chosenRoomId,
    ownerId,
    userInfo,
    currentMessageId,
    messageUserId
  } = useAppSelector(
    (state) => state.auth);
  const socket = getSocket();
  const {closeRoom} = useCloseRoom();
  const deleteOneMessage = () => {
    if (contextMenu.type !== 'text') {
      const imageRef = ref(storage, contextMenu.fullPath);
      deleteObject(imageRef).then(() => {
        socket.emit('deleteMessage', {
          messageUserId,
          ownerId,
          userId: userInfo?.userId,
          messageId: currentMessageId,
          roomName: currentRoom,
          roomId: Number(currentRoomId),
        });
      });
    } else {
      socket.emit('deleteMessage', {
        messageUserId,
        ownerId,
        userId: userInfo?.userId,
        messageId: currentMessageId,
        roomName: currentRoom,
        roomId: Number(currentRoomId),
      });
    }
    closeModal();
  };
  const deleteRoomFolder = (folderPath: string) => {
    const folderRef = ref(storage, folderPath);
    listAll(folderRef).then((result) => {
      result.prefixes.map((subFolderRef) => {
        deleteRoomFolder(subFolderRef.fullPath);
      });
      result.items.map((itemRef) => {
        deleteObject(itemRef);
      });
    });
  };
  
  const deleteOneRoom = async() => {
    await deleteRoom({id: Number(chosenRoomId), ownerId: Number(chosenOwnerId)});
    deleteRoomFolder(String(chosenRoom));
    closeModal();
    if (chosenRoomId === currentRoomId) {
      closeRoom();
    }
  };
  return (
    <motion.div
      className={styles.delete}
      initial={{scale: 0.7}}
      animate={{scale: 1}}
      transition={{duration: 0.4}}
    >
      <p className={styles.delete__text}>Are you sure you want to delete?</p>
      <div className={'flex justify-around items-center mt-10 gap-[20px]'}>
        <button className={styles.delete__cancelButton} onClick={closeModal}>Cancel</button>
        <button className={styles.delete__deleteButton}
          onClick={location === 'message' ? deleteOneMessage : deleteOneRoom}>
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default DeleteModal;