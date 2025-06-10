'use client';
import { useCallback, useEffect } from 'react';
import { useAppDispatch } from '../lib/hooks';
import { getRefreshToken } from '../api/cookiesOperation';
import { getIsAuth } from '../lib/slice';
import { useRegenerateTokenMutation } from '../lib/authApi';
import { useGetUserInfoQuery } from '../lib/userApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const useGetInfo = () => {
  const dispatch = useAppDispatch();
  const [regenerateToken] = useRegenerateTokenMutation();
  const {error} = useGetUserInfoQuery('');
  const userError = error as FetchBaseQueryError & {data: {message: string; code: string, name: string}};
  
  const getUserData = useCallback(async() => {
    if (userError?.data.name === 'TokenExpiredError') {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        await regenerateToken(refreshToken);
      }
    }
  }, [userError]);
  
  useEffect(() => {
    dispatch(getIsAuth());
    getUserData();
  }, [getUserData]);
  
};
