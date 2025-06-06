'use client';
import { useCallback, useEffect } from 'react';
import { useAppDispatch } from '../lib/hooks';
import { getUserInfo, regenerateToken } from '../api/AuthProvider';
import { getAllTodos } from '../api/TodoProvider';
import { getRefreshToken } from '../api/cookiesOperation';
import { getIsAuth } from '../lib/slice';

export const useGetInfo = () => {
  const dispatch = useAppDispatch();
  
  const getUserData = useCallback(async() => {
    const userData = await dispatch(getUserInfo());
    await dispatch(getAllTodos());
    if (userData.payload.name === 'TokenExpiredError') {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        await regenerateToken(refreshToken);
        await dispatch(getUserInfo());
        await dispatch(getAllTodos());
      }
    }
  }, []);
  
  useEffect(() => {
    dispatch(getIsAuth());
    getUserData();
  }, [getUserData]);
  
};
