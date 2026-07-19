'use client';
import React from 'react';
import styles from './modals.module.scss';
import { useModal } from '../../../../../providers/ModalProvider/ModalProvider.hooks';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../../../../lib/hooks';
import { getSocket } from '../../../../../api/socket';

interface ChangeMessageVersionModalProps {
  message: string;
  type: string;
  fileName: string;
  fileSize: string;
  fullPath: string;
}

const ChangeMessageVersionModal = ({message, type, fullPath, fileName, fileSize}: ChangeMessageVersionModalProps) => {
  const {closeModal} = useModal();
  const {currentMessageId} = useAppSelector(state => state.messages);
  const {userInfo} = useAppSelector(state => state.auth);
  const socket = getSocket();
  const {currentRoom} = useAppSelector(state => state.rooms);
  const changeMessageVersion = () => {
    socket.emit('changeMessageVersion', {
      messageId: currentMessageId,
      userId: userInfo?.userId,
      roomName: currentRoom?.name,
      message,
      type,
      fullPath,
      fileName,
      fileSize,
    });
    closeModal();
  };
  
  return (
    <motion.div
      className={styles.delete}
      initial={{scale: 0.7}}
      animate={{scale: 1}}
      transition={{duration: 0.4}}
    >
      <p className={styles.delete__text}>This version will become current one</p>
      <div className={'flex justify-around items-center mt-10 gap-[20px]'}>
        <button className={styles.delete__cancelButton} onClick={closeModal}>Cancel</button>
        <button className={styles.delete__deleteButton} onClick={changeMessageVersion}>
          OK
        </button>
      </div>
    </motion.div>
  );
};

export default ChangeMessageVersionModal;