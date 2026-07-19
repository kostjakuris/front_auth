'use client';
import React, { FC, useEffect, useState } from 'react';
import styles from './modals.module.scss';
import { useModal } from '../../../../../providers/ModalProvider/ModalProvider.hooks';
import { useAppDispatch, useAppSelector } from '../../../../../lib/hooks';
import { getSocket } from '../../../../../api/socket';
import Image from 'next/image';
import { motion } from 'framer-motion';
import File from '../../../../../../public/images/File';
import { showToast } from 'nextjs-toast-notify';
import { getRoomData } from '../../../../../utils/getRoomData';
import { formatFileSize, resolveMessageType, uploadToStorage } from '../../../../../utils/uploadToStorage';
import { setIsReplaceMessage } from '../../../../../lib/messagesSlice';


interface SendImageModalProps {
  selectedFile: EventTarget & HTMLInputElement;
}

const SendModal: FC<SendImageModalProps> = ({selectedFile}) => {
  const {closeModal} = useModal();
  const {userInfo} = useAppSelector(state => state.auth);
  const {currentRoom} = useAppSelector(state => state.rooms);
  const {isReplaceMessage, currentMessageId, messageUserId} = useAppSelector(state => state.messages);
  const socket = getSocket();
  const dispatch = useAppDispatch();
  const [chosenFile, setChosenFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const {resolveRoomData} = getRoomData();
  
  const handleFile = () => {
    if (selectedFile.files && selectedFile.files[0]) {
      const file = selectedFile.files[0];
      
      if (file.size > 1000000000) {
        closeModal();
        showToast.success('File size is too big. Max size is 1GB.', {
          duration: 3000,
          position: 'bottom-right',
          transition: 'bounceIn',
          icon: '<svg id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle style="fill:#D75A4A;" cx="25" cy="25" r="25"></circle> <polyline style="fill:none;stroke:#FFFFFF;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" points="16,34 25,25 34,16 "></polyline> <polyline style="fill:none;stroke:#FFFFFF;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;" points="16,16 25,25 34,34 "></polyline> </g></svg>',
          sound: false,
          progress: true,
        });
        selectedFile.value = '';
        return;
        
      }
      
      setChosenFile(file);
      
      const reader = new FileReader();
      const fileUrl = URL.createObjectURL(file);
      
      reader.onload = () => {
        if (file.type.startsWith('image/')) {
          setSelectedImage(reader.result as string);
        } else if (file.type.startsWith('video/')) {
          setSelectedVideo(fileUrl);
        }
      };
      
      reader.readAsDataURL(file);
    }
    
    selectedFile.value = '';
  };
  
  const submitFile = async() => {
    const {roomName, roomId} = await resolveRoomData();
    if (chosenFile) {
      const type = resolveMessageType(chosenFile.type);
      const folder = type === 'image' ? 'images' : type === 'video' ? 'videos' : 'files';
      const {url, fullPath} = await uploadToStorage(roomName ?? '', folder, chosenFile.name, chosenFile, {
        contentType: chosenFile.type,
        contentDisposition: chosenFile.name,
      });
      if (isReplaceMessage) {
        socket.emit('editMessage', {
          messageUserId,
          ownerId: currentRoom?.ownerId,
          currentMessageId,
          userId: userInfo?.userId,
          roomId,
          roomName,
          content: url,
          fileName: chosenFile.name,
          fileSize: formatFileSize(chosenFile.size),
          fullPath,
          username: userInfo?.username,
          type,
        });
        dispatch(setIsReplaceMessage(false));
      } else {
        socket.emit('sendMessage', {
          userId: userInfo?.userId,
          roomName,
          roomId,
          content: url,
          fileName: chosenFile.name,
          fileSize: formatFileSize(chosenFile.size),
          fullPath,
          username: userInfo?.username,
          type,
        });
      }
      setChosenFile(null);
      closeModal();
    }
  };
  
  const formatFileName = (name: string): string => {
    if (name.length < 30) return name;
    return `${name.slice(0, 10)}...${name.slice(-10)}`;
  };
  
  useEffect(() => {
    handleFile();
  }, [selectedFile.files]);
  return (
    <motion.div
      className={styles.send}
      initial={{scale: 0.7}}
      animate={{scale: 1}}
      transition={{duration: 0.4}}
    >
      {
        selectedImage &&
        <Image src={selectedImage} className={styles.send__image} alt={'selected image'} width={330} height={300} />
      }
      {
        selectedVideo &&
        <video controls width='330' height='300' className={styles.send__image}>
          <source src={selectedVideo} type={chosenFile?.type} />
        </video>
      }
      {
        chosenFile && !selectedImage && !selectedVideo &&
        <div className={'flex items-end gap-[15px] ml-[40px]'}>
          <span className={'bg-[#3a5bbf] rounded-full p-[10px]'}><File /></span>
          <div>
            <p className={`${styles.send__text} mt-0! font-medium!`}>{formatFileName(chosenFile.name)}</p>
            <p className={'mt-[5px] leading-[100%] text-white/70 text-[16px]'}>{formatFileSize(chosenFile.size)}</p>
          </div>
        </div>
      }
      <div className={'flex justify-between items-center mt-6 gap-[15px]'}>
        <button className={styles.send__cancelButton} onClick={() => {
          closeModal();
          setChosenFile(null);
          if (isReplaceMessage) dispatch(setIsReplaceMessage(false));
        }}>Cancel
        </button>
        <button className={styles.send__deleteButton} onClick={submitFile}>
          {isReplaceMessage ? 'Replace' : 'Send'}
        </button>
      </div>
    </motion.div>
  );
};

export default SendModal;