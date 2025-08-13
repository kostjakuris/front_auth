'use client';
import React, { FC, useEffect, useState } from 'react';
import styles from './modals.module.scss';
import { useModal } from '../../../../../providers/ModalProvider/ModalProvider.hooks';
import { useAppSelector } from '../../../../../lib/hooks';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { storage } from '../../../../../firebase';
import { v4 } from 'uuid';
import { getSocket } from '../../../../../api/socket';
import Image from 'next/image';

interface SendImageModalProps {
  selectedFile: EventTarget & HTMLInputElement;
}

const SendImageModal: FC<SendImageModalProps> = ({selectedFile}) => {
  const {closeModal} = useModal();
  const {userId, userName, currentRoomId, currentRoom} = useAppSelector((state) => state.auth);
  const socket = getSocket();
  const [chosenFile, setChosenFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  const handleFile = () => {
    const allowedTypes = ['image/', 'video/'];
    
    if (selectedFile.files && selectedFile.files[0]) {
      const file = selectedFile.files[0];
      
      const isAllowedType = allowedTypes.some(
        (type) => file.type.startsWith(type) && !file.type.startsWith('image/svg')
      );
      
      if (isAllowedType) {
        setChosenFile(file);
      }
      
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
  
  const createFileRef = () => {
    if (chosenFile && chosenFile.type.startsWith('image/')) {
      return ref(storage, `${currentRoom}/images/${chosenFile.name + v4()}`);
    } else if (chosenFile && chosenFile.type.startsWith('video/')) {
      return ref(storage, `${currentRoom}/videos/${chosenFile.name + v4()}`);
    }
  };
  const submitFile = async() => {
    if (chosenFile) {
      const fileRef = createFileRef();
      if (!fileRef) return;
      uploadBytes(fileRef, chosenFile).then((response) => {
        getDownloadURL(fileRef).then((url) => {
          socket.emit('sendMessage', {
            userId,
            roomName: currentRoom,
            roomId: Number(currentRoomId),
            content: url,
            fullPath: response.metadata.fullPath,
            username: userName,
            type: chosenFile.type.substring(0, chosenFile.type.indexOf('/'))
          });
        });
      });
      setChosenFile(null);
      closeModal();
    }
  };
  
  useEffect(() => {
    handleFile();
  }, [selectedFile.files]);
  return (
    <div className={styles.send}>
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
      <div className={'flex justify-around items-center mt-10 mb-5'}>
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