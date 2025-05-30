'use client';
import React, { useEffect } from 'react';
import styles from './authorized.module.scss';
import { useRouter } from 'next/navigation';
import { getRefreshToken } from '../../api/cookiesOperation';
import { getUserInfo, logout, regenerateToken } from '../../api/AuthProvider';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { getIsAuth } from '../../lib/slice';
import { FadeLoader } from 'react-spinners';

const AuthorizedPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {error, isLoading, username, email, isAuth} = useAppSelector((state) => state);
  
  
  const getUserData = async() => {
    await dispatch(getUserInfo());
    if (error === 'TokenExpiredError') {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        await regenerateToken(refreshToken);
        await dispatch(getUserInfo());
      }
    }
  };
  
  useEffect(() => {
    dispatch(getIsAuth());
    getUserData();
  }, []);
  
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
      <button className={styles.authorized__button} onClick={async() => await dispatch(logout(router))}>Log out</button>
      <div className={styles.authorized}>
        <p className={styles.authorized__text}>userName: {username}</p>
        <p className={styles.authorized__text}>email: {email}</p>
      </div>
    </div>
  );
};

export default AuthorizedPage;