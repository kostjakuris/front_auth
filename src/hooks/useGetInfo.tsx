'use client';
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { getRefreshToken, getToken } from '../api/cookiesOperation';
import { getIsAuth } from '../lib/slice';
import { useGetUserInfoQuery, useRegenerateTokenMutation } from '../lib/userApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useRouter } from 'next/navigation';

export const useGetInfo = () => {
  const {isAuth} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [regenerateToken] = useRegenerateTokenMutation();
  const {data: userData, error} = useGetUserInfoQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !isAuth,
  });
  const router = useRouter();
  
  const userError = error as FetchBaseQueryError & {data: {message: {name: string}; code: string}};
  
  const getUserData = useCallback(async() => {
    if (userError?.data?.message.name === 'TokenExpiredError') {
      const refreshToken = await getRefreshToken();
      console.log(refreshToken, 'refreshToken');
      if (refreshToken) {
        await regenerateToken(refreshToken);
      }
    }
  }, [userError]);
  
  useEffect(() => {
    dispatch(getIsAuth());
    getUserData();
    getToken().then(response => {
      if (response) {
        console.log(response, 'response');
        localStorage.setItem('isAuth', 'true');
        dispatch(getIsAuth());
      } else {
        localStorage.setItem('isAuth', 'false');
        dispatch(getIsAuth());
        router.push('/auth');
      }
    });
  }, [getUserData, userData]);
  
};
