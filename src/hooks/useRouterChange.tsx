'use client';

import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { useRouter } from 'next/navigation';
import { getIsAuth } from '../lib/slice';

export const useRouterChange = (isSuccess: boolean) => {
  const {isAuth} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const checkIsAuth = useCallback(() => {
    if (isAuth) {
      router.push('/authorized');
    } else {
      router.push('/auth');
    }
  }, [isAuth]);
  
  useEffect(() => {
    dispatch(getIsAuth());
    if (isSuccess) {
      localStorage.setItem('isAuth', 'true');
      router.push('/authorized');
    }
  }, [isSuccess]);
  
  useEffect(() => {
    checkIsAuth();
  }, [checkIsAuth]);
  
};
