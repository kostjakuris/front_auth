'use client';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../lib/hooks';
import { useCreateNewRoomMutation, useEditRoomMutation } from '../../../../../lib/roomApi';
import { setChosenRoom, setIsEditRoom, setRoomName } from '../../../../../lib/slice';
import { Input } from '../../../../ui/input';
import styles from './modals.module.scss';
import { useModal } from '../../../../../providers/ModalProvider/ModalProvider.hooks';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';

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
  
  const {chosenRoomId, userInfo, isEditRoom, chosenOwnerId, chosenRoom} = useAppSelector(
    state => state.auth);
  
  
  const submitRoomName = async(name: string) => {
    if (isEditRoom) {
      await editRoom({id: Number(chosenRoomId), name, ownerId: Number(chosenOwnerId)});
    } else {
      await createNewRoom({name, ownerId: Number(userInfo?.userId)});
    }
    dispatch(setRoomName(''));
    dispatch(setChosenRoom(''));
    dispatch(setIsEditRoom(false));
    closeModal();
  };
  
  const formik = useFormik<CreateRoomFormFields>({
    initialValues: {
      roomName: chosenRoom ? chosenRoom : '',
    },
    validationSchema: createRoomSchema,
    onSubmit: async(values: CreateRoomFormFields) => {
      await submitRoomName(values.roomName);
    },
  });
  
  
  return (
    <motion.div
      className={styles.createModal}
      initial={{scale: 0.7}}
      animate={{scale: 1}}
      transition={{duration: 0.4}}
    >
      <p className={'text-white text-center mb-[20px]'}>{isEditRoom ? 'Edit selected room' : 'Create new room'}</p>
      <form onSubmit={formik.handleSubmit}>
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
        <div className={'flex justify-around items-center gap-[20px]'}>
          <button className={styles.delete__cancelButton} onClick={closeModal}>Cancel</button>
          <button className={styles.createModal__submit} type='submit'>
            {isEditRoom ? 'Save' : 'Create'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateAndEditRoomModal;