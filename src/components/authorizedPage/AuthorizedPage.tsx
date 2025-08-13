'use client';
import React, { useEffect, useState } from 'react';
import styles from './authorized.module.scss';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { FadeLoader } from 'react-spinners';
import { useGetInfo } from '../../hooks/useGetInfo';
import { useLazyLogoutQuery } from '../../lib/authApi';
import { useGetUserInfoQuery } from '../../lib/userApi';
import { Chat } from './index';
import { setUserInfo } from '../../lib/slice';

const AuthorizedPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const dispatch = useAppDispatch();
    const {userName} = useAppSelector((state) => state.auth);
    
    const {
      isAuth,
    } = useAppSelector(
      (state) => state.auth);
    
    const [_, {isLoading: isLogoutLoading}] = useLazyLogoutQuery();
    const {data: userData, isLoading: isUserInfoLoading} = useGetUserInfoQuery('');
    const isLoading = isLogoutLoading || isUserInfoLoading;
    
    
    useGetInfo();
    
    useEffect(() => {
      if (userData) {
        setEmail(userData.email);
        dispatch(setUserInfo({userName: userData.username, userId: userData.userId}));
      }
    }, [userData]);
    
    if (isLoading) {
      return (
        <div className={styles.authorized__wrapper}>
          <div className={styles.authorized}>
            <FadeLoader color={'white'} loading={true} />
          </div>
        </div>
      );
    }
    
    if (!isAuth) {
      return (
        <div className={styles.authorized__wrapper}>
          <div className={styles.authorized}>
            <p className={styles.authorized__text}>Access denied</p>
            <button className={styles.authorized__button} onClick={() => router.push('/auth')}>
              Return to auth page
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className={styles.authorized__wrapper}>
        <Chat />
        <div className={styles.authorized}>
          <p className={styles.authorized__text}>userName: {userName}</p>
          <p className={styles.authorized__text}>email: {email}</p>
        </div>
      </div>
    );
  }
;

export default AuthorizedPage;