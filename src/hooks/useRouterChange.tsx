'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { useRouter } from 'next/navigation';
import { getIsAuth, setIsAuthLoading } from '../lib/slice';

export const useRouterChange = (isSuccess: boolean) => {
  const {isAuth} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem('isAuth', 'true');
    }
    dispatch(getIsAuth());
    if (isSuccess) {
      router.replace('/');
    }
  }, [isSuccess]);
  
  useEffect(() => {
    const checkIsAuth = () => {
      if (isAuth) {
        router.replace('/');
      } else {
        dispatch(setIsAuthLoading(false));
      }
    };
    dispatch(setIsAuthLoading(true));
    checkIsAuth();
  }, [isAuth]);
  
  
};
