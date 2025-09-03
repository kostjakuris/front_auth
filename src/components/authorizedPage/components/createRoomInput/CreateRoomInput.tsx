'use client';
import React from 'react';
import styles from '../../../authorizedPage/authorized.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../lib/hooks';
import { setIsCreateRoom, setIsEditRoom, setRoomName } from '../../../../lib/slice';
import { Input } from '../../../ui/input';
import { useCreateNewRoomMutation, useEditRoomMutation } from '../../../../lib/roomApi';

const CreateRoomInput = () => {
  const dispatch = useAppDispatch();
  const [createNewRoom] = useCreateNewRoomMutation();
  const [editRoom] = useEditRoomMutation();
  const {currentRoomId, userId, isCreateRoom, isEditRoom, ownerId, roomName} = useAppSelector(
    state => state.auth);
  
  const submitRoomName = async(event: any) => {
    event.preventDefault();
    if (isEditRoom) {
      await editRoom({id: Number(currentRoomId), name: String(roomName), ownerId: Number(ownerId)});
    } else {
      await createNewRoom({name: String(roomName), ownerId: Number(userId)});
    }
    dispatch(setRoomName(''));
    dispatch(setIsCreateRoom(false));
    dispatch(setIsEditRoom(false));
  };
  return (
    <div className={'flex items-center justify-center flex-col mt-10'}>
      <button className={styles.authorized__button}
        onClick={() => dispatch(setIsCreateRoom(!isCreateRoom))}>
        Create new room
      </button>
      <form onSubmit={submitRoomName} className={!isCreateRoom ? 'hidden' : 'block mt-5'}>
        <Input
          name='room'
          placeholder='Room name'
          type={'text'}
          value={roomName ? roomName : ''}
          onChangeFn={(event) => setRoomName(event.target.value)}
          class_name={styles.authorized__chat_input}
        />
        <button className={styles.authorized__submit} type='submit'>
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateRoomInput;