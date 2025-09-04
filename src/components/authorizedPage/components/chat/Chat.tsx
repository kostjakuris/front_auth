'use client';
import React from 'react';
import styles from '../../authorized.module.scss';
import { getIsAuth } from '../../../../lib/slice';
import { useAppDispatch } from '../../../../lib/hooks';
import { useRouter } from 'next/navigation';
import { useLazyLogoutQuery } from '../../../../lib/authApi';
import { useCreateNewRoomMutation, useGetAllRoomsQuery } from '../../../../lib/roomApi';
import { FadeLoader } from 'react-spinners';
import RoomsData from '../roomsData/RoomsData';
import CreateRoomInput from '../createRoomInput/CreateRoomInput';


const Chat = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logout] = useLazyLogoutQuery();
  const {isLoading} = useGetAllRoomsQuery('');
  const [_, {isLoading: isCreateRoomLoading}] = useCreateNewRoomMutation();
  
  const logoutFn = async() => {
    await logout('');
    localStorage.setItem('isAuth', 'false');
    dispatch(getIsAuth());
    router.push('/auth');
  };
  
  
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
    <div>
      <div className={'flex items-center justify-between px-5'}>
        <button className={styles.authorized__button} onClick={logoutFn}>Log out</button>
        <div></div>
      </div>
      <CreateRoomInput />
      <RoomsData />
    </div>
  );
};

export default Chat;