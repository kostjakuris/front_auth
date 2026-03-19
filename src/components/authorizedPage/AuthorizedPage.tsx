'use client';
import React, { useEffect } from 'react';
import styles from './authorized.module.scss';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { FadeLoader } from 'react-spinners';
import { useGetInfo } from '../../hooks/useGetInfo';
import { useGetUserInfoQuery } from '../../lib/userApi';
import { Chat } from './index';
import { setIsAuthLoading, setUserInfo } from '../../lib/slice';
import { useGetAllRoomsQuery } from '../../lib/roomApi';

const AuthorizedPage = () => {
  const dispatch = useAppDispatch();
  
  const {isAuthLoading, isAuth} = useAppSelector((state) => state.auth);
  const {data: roomData} = useGetAllRoomsQuery(undefined, {skip: !isAuth, refetchOnMountOrArgChange: true});
  
  const {data: userData, isLoading: isUserInfoLoading} = useGetUserInfoQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !isAuth,
  });
  const isLoading = isUserInfoLoading || isAuthLoading;
  
  useGetInfo();
  
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