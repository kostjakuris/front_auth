'use client';
import React from 'react';
import styles from '../../authorized.module.scss';
import { useAppSelector } from '../../../../lib/hooks';
import { useCreateNewRoomMutation, useGetAllRoomsQuery } from '../../../../lib/roomApi';
import RoomsData from '../roomsData/RoomsData';
import { FadeLoader } from 'react-spinners';


const Chat = () => {
  const {isAuth} = useAppSelector(state => state.auth);
  const {isLoading} = useGetAllRoomsQuery(undefined, {skip: !isAuth, refetchOnMountOrArgChange: true});
  const [_, {isLoading: isCreateRoomLoading}] = useCreateNewRoomMutation();
  
  if (isLoading || isCreateRoomLoading) {
    return (
      <div className={styles.authorized__wrapper}>
        <div className={styles.authorized}>
          <FadeLoader color={'white'} loading={true} />
        </div>
      </div>
    );
  }
  
  return (
    <div className={'h-full'}>
      <RoomsData />
    </div>
  );
};

export default Chat;