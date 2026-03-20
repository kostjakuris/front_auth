'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '../lib/hooks';
import { useRouter } from 'next/navigation';
import { getIsAuth, setIsAuthLoading, setUserInfo } from '../lib/slice';
import { useGetUserInfoQuery } from '../lib/userApi';

export const useGetUserInfo = (isSuccess?: boolean) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {data: userData} = useGetUserInfoQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  
  useEffect(() => {
    const checkUserData = () => {
      if (userData) {
        dispatch(setUserInfo(userData));
        dispatch(getIsAuth());
        localStorage.setItem('isAuth', 'true');
        router.replace('/');
      } else {
        localStorage.setItem('isAuth', 'false');
        dispatch(getIsAuth());
        router.replace('/auth');
        dispatch(setIsAuthLoading(false));
      }
    };
    checkUserData();
  }, [userData, isSuccess]);
  
};
