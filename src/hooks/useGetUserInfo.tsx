'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '../lib/hooks';
import { useRouter } from 'next/navigation';
import { getIsAuth, setIsAuthLoading, setUserInfo } from '../lib/slice';
import { useGetUserInfoQuery } from '../lib/userApi';

export const useGetUserInfo = (isSuccess?: boolean) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {data: userData, isError} = useGetUserInfoQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  
  useEffect(() => {
    if (userData) {
      dispatch(setUserInfo(userData));
      dispatch(getIsAuth());
      localStorage.setItem('isAuth', 'true');
      router.replace('/');
    }
    if (isError) {
      localStorage.removeItem('isAuth');
      dispatch(setIsAuthLoading(false));
      router.replace('/auth');
    }
  }, [userData, isError, isSuccess]);
  
};
