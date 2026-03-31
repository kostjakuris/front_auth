'use client';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../lib/hooks';
import { useCreateNewRoomMutation, useEditRoomMutation } from '../../../../../lib/roomApi';
import { setChosenRoom, setIsEditRoom, setRoomName } from '../../../../../lib/roomsSlice';
import { Input } from '../../../../ui/input';
import styles from './modals.module.scss';
import { useModal } from '../../../../../providers/ModalProvider/ModalProvider.hooks';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import { InputFile } from '../../../../ui/inputFile';
import Camera from '../../../../../../public/images/Camera';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { storage } from '../../../../../firebase';
import { v4 } from 'uuid';
import { FadeLoader } from 'react-spinners';

interface CreateRoomFormFields {
  roomName: string;
}

export const createRoomSchema = Yup.object().shape({
  roomName: Yup.string().trim().required('Room name is required.'),
});

const CreateAndEditRoomModal = () => {
  const dispatch = useAppDispatch();
  const [createNewRoom] = useCreateNewRoomMutation();
  const [editRoom] = useEditRoomMutation();
  const {closeModal} = useModal();
  const [isLoading, setIsLoading] = useState(false);
  
  const {userInfo} = useAppSelector(state => state.auth);
  const {isEditRoom, chosenRoom} = useAppSelector(state => state.rooms);
  
  const [chosenFile, setChosenFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const submitRoomName = async(name: string) => {
    let avatar = chosenRoom?.avatar || '';
    try {
      setIsLoading(true);
      if (chosenFile) {
        const fileRef = ref(storage, `/rooms/avatars/${chosenFile.name + v4()}`);
        await uploadBytes(fileRef, chosenFile, {
          contentType: chosenFile.type,
          contentDisposition: chosenFile.name,
        });
        avatar = await getDownloadURL(fileRef);
      }
      if (isEditRoom) {
        await editRoom({id: Number(chosenRoom?.id), name, ownerId: Number(chosenRoom?.ownerId), avatar});
      } else {
        await createNewRoom({name, ownerId: Number(userInfo?.userId), avatar});
      }
      setChosenFile(null);
      dispatch(setRoomName(''));
      dispatch(setChosenRoom(null));
      dispatch(setIsEditRoom(false));
      closeModal();
    } catch (error) {
      setIsLoading(false);
      console.error('Error uploading file:', error);
    } finally {
      setIsLoading(false);
    }
    
  };
  
  const formik = useFormik<CreateRoomFormFields>({
    initialValues: {
      roomName: chosenRoom?.name ?? '',
    },
    validationSchema: createRoomSchema,
    onSubmit: async(values: CreateRoomFormFields) => {
      await submitRoomName(values.roomName);
    },
  });
  
  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      setChosenFile(file);
      
      const reader = new FileReader();
      
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      
      reader.readAsDataURL(file);
    }
    
    event.target.value = '';
  };
  
  if (isLoading) {
    return (
      <div className={'w-full h-full flex items-center justify-center'}>
        <FadeLoader color={'white'} loading={true} />
      </div>
    );
  }
  
  return (
    <motion.div
      className={styles.createModal}
      initial={{scale: 0.7}}
      animate={{scale: 1}}
      transition={{duration: 0.4}}
    >
      <p className={'text-white text-center mb-[20px]'}>{isEditRoom ? 'Edit selected room' : 'Create new room'}</p>
      <form onSubmit={formik.handleSubmit}>
        <div className={'flex justify-center items-center mb-[20px]'}>
          <InputFile
            buttonImage={
              <div>
                {
                  selectedImage || chosenRoom?.avatar ?
                    <img
                      src={selectedImage || chosenRoom?.avatar}
                      className={'rounded-full w-[80px] h-[80px] object-cover object-center'}
                      alt={'selected image'}
                    />
                    : <Camera className={'w-[50px] h-[50px]'} />
                }
              </div>
            }
            onChangeFn={(event) => handleFile(event)}
          />
        </div>
        <Input
          name='roomName'
          placeholder='Room name'
          type={'text'}
          class_name={styles.createModal__input}
          value={formik.values.roomName}
          onChangeFn={formik.handleChange}
          onBlurFn={formik.handleBlur}
          isTouched={formik.touched.roomName}
          error={formik.errors.roomName}
        />
        <div className={'flex justify-around items-center mt-[20px] gap-[20px]'}>
          <button className={styles.delete__cancelButton} onClick={() => {
            closeModal();
            dispatch(setChosenRoom(null));
            
          }}>Cancel
          </button>
          <button className={styles.createModal__submit} type='submit'>
            {isEditRoom ? 'Save' : 'Create'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateAndEditRoomModal;