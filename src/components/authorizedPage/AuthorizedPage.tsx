'use client';
import React, { useEffect } from 'react';
import styles from './authorized.module.scss';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { FadeLoader } from 'react-spinners';
import { useGetUserInfoQuery } from '../../lib/userApi';
import { Chat } from './index';
import { setIsAuthLoading, setUserInfo } from '../../lib/slice';
import { useGetAllRoomsQuery } from '../../lib/roomApi';
import { useGetUserInfo } from '../../hooks/useGetUserInfo';

const AuthorizedPage = () => {
  const dispatch = useAppDispatch();
  
  const {isAuthLoading, isAuth} = useAppSelector((state) => state.auth);
  const {data: roomData} = useGetAllRoomsQuery(undefined, {refetchOnMountOrArgChange: true});
  
  const {data: userData, isLoading: isUserInfoLoading} = useGetUserInfoQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const isLoading = isUserInfoLoading || isAuthLoading;
  
  useGetUserInfo();
  
  useEffect(() => {
    if (userData) {
      dispatch(setUserInfo({...userData}));
    }
    if (roomData && userData) {
      dispatch(setIsAuthLoading(false));
    }
  }, [userData, roomData]);
  
  
  if (isLoading) {
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