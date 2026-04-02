'use client';
import React, { useEffect } from 'react';
import styles from './authorized.module.scss';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { FadeLoader } from 'react-spinners';
import { Chat } from './index';
import { setIsAuthLoading } from '../../lib/authSlice';
import { useGetAllRoomsQuery } from '../../lib/roomApi';
import { useGetUserInfo } from '../../hooks/useGetUserInfo';
import { getSocket } from '../../api/socket';

const AuthorizedPage = () => {
  const dispatch = useAppDispatch();
  
  const {isAuthLoading, isAuth, userInfo} = useAppSelector((state) => state.auth);
  const {data: roomData} = useGetAllRoomsQuery(undefined, {skip: !isAuth, refetchOnMountOrArgChange: true});
  
  useGetUserInfo();
  
  useEffect(() => {
    if (roomData) {
      dispatch(setIsAuthLoading(false));
    }
  }, [roomData]);
  
  useEffect(() => {
    if (userInfo) {
      const socket = getSocket();
      socket.emit('joinUserRoom', {userId: String(userInfo.userId)});
    }
  }, [userInfo]);
  
  
  if (isAuthLoading) {
    return (
      <div className={styles.authorized__wrapper}>
        <div className={styles.authorized}>
          <FadeLoader color={'white'} loading={true} />
        </div>
      </div>
    );
  }
  
  return (
    <section className={styles.authorized__wrapper}>
      <Chat />
    </section>
  );
};


export default AuthorizedPage;