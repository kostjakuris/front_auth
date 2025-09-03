'use client';
import { useCallback, useEffect } from 'react';
import { useAppDispatch } from '../lib/hooks';
import { getRefreshToken, getToken } from '../api/cookiesOperation';
import { getIsAuth } from '../lib/slice';
import { useGetUserInfoQuery, useRegenerateTokenMutation } from '../lib/userApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const useGetInfo = () => {
  const dispatch = useAppDispatch();
  const [regenerateToken] = useRegenerateTokenMutation();
  const {error} = useGetUserInfoQuery('');
  const userError = error as FetchBaseQueryError & {data: {message: {name: string}; code: string}};
  
  const getUserData = useCallback(async() => {
    if (userError?.data.message.name === 'TokenExpiredError') {
      const refreshToken = await getRefreshToken();
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
        localStorage.setItem('isAuth', 'true');
      }
    });
  }, [getUserData]);
  
};
