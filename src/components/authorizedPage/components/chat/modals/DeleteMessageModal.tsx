'use client';
import React, { FC } from 'react';
import styles from './modals.module.scss';
import { useModal } from '../../../../../providers/ModalProvider/ModalProvider.hooks';
import { deleteObject, listAll, ref } from '@firebase/storage';
import { storage } from '../../../../../firebase';
import { useDeleteRoomMutation } from '../../../../../lib/roomApi';
import { getSocket } from '../../../../../api/socket';
import { useAppSelector } from '../../../../../lib/hooks';
import { MenuProps } from '../../../../ui/contextMenu/ContextMenu';
import { useCloseRoom } from '../../../../../hooks/useCloseRoom';

interface DeleteModalProps extends Omit<MenuProps, 'setRoomName' | 'closeContextMenu'> {
}

const DeleteMessageModal: FC<DeleteModalProps> = ({contextMenu, location}) => {
  const {closeModal} = useModal();
  const [deleteRoom] = useDeleteRoomMutation();
  const {currentRoom, ownerId, userId, currentRoomId, currentMessageId, messageUserId} = useAppSelector(
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
          userId,
          messageId: currentMessageId,
          roomName: currentRoom,
        });
      });
    } else {
      socket.emit('deleteMessage', {
        messageUserId,
        ownerId,
        userId,
        messageId: currentMessageId,
        roomName: currentRoom,
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
    await deleteRoom({id: Number(currentRoomId), ownerId: Number(ownerId)});
    deleteRoomFolder(String(currentRoom));
    closeModal();
    closeRoom();
  };
  return (
    <div className={styles.delete}>
      <p className={styles.delete__text}>Are you sure you want to delete?</p>
      <div className={'flex justify-around items-center mt-10 mb-5'}>
        <button className={styles.delete__cancelButton} onClick={closeModal}>Cancel</button>
        <button className={styles.delete__deleteButton}
          onClick={location === 'message' ? deleteOneMessage : deleteOneRoom}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteMessageModal;