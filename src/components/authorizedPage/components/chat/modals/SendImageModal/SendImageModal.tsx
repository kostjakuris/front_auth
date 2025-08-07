'use client';
import React, { FC, useEffect, useState } from 'react';
import styles from '../modals.module.scss';
import { useModal } from '../../../../../../providers/ModalProvider/ModalProvider.hooks';
import { useAppSelector } from '../../../../../../lib/hooks';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { storage } from '../../../../../../firebase';
import { v4 } from 'uuid';
import { getSocket } from '../../../../../../api/socket';
import Image from 'next/image';

interface SendImageModalProps {
  selectedFile: EventTarget & HTMLInputElement;
}

const SendImageModal: FC<SendImageModalProps> = ({selectedFile}) => {
  const {closeModal} = useModal();
  const {userId, userName, currentRoomId, currentRoom} = useAppSelector((state) => state.auth);
  const socket = getSocket();
  const [chosenFile, setChosenFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  
  const handleFile = () => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/bmp'];
    
    if (selectedFile.files) {
      if (allowedTypes.includes(selectedFile.files[0]?.type)) {
        setChosenFile(selectedFile.files[0]);
      }
      if (selectedFile.files[0]) {
        const reader = new FileReader();
        
        reader.onload = () => {
          setSelectedImage(reader.result);
        };
        
        reader.readAsDataURL(selectedFile.files[0]);
      }
    }
    selectedFile.value = '';
    
  };
  
  useEffect(() => {
    handleFile();
  }, [selectedFile]);
  
  const submitFile = async() => {
    if (chosenFile) {
      const imageRef = ref(storage, `${currentRoom}/images/${chosenFile.name + v4()}`);
      uploadBytes(imageRef, chosenFile).then((response) => {
        getDownloadURL(imageRef).then((url) => {
          socket.emit('sendMessage', {
            userId,
            roomName: currentRoom,
            roomId: Number(currentRoomId),
            content: url,
            fullPath: response.metadata.fullPath,
            username: userName,
            type: 'image'
          });
        });
      });
      setChosenFile(null);
      closeModal();
    }
  };
  return (
    <div className={styles.send}>
      {
        selectedImage &&
        <Image src={selectedImage} className={styles.send__image} alt={'selected image'} width={330} height={300} />
      }
      <div className={'flex justify-around items-center mt-10'}>
        <button className={styles.send__cancelButton} onClick={() => {
          closeModal();
          setChosenFile(null);
        }}>Cancel
        </button>
        <button className={styles.send__deleteButton} onClick={submitFile}>
          Send
        </button>
      </div>
    </div>
  );
};

export default SendImageModal;