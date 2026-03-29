'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '../lib/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { getIsAuth, setIsAuthLoading, setUserInfo } from '../lib/slice';
import { useGetUserInfoQuery } from '../lib/userApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const useGetUserInfo = (
  isSuccess?: boolean,
  authError?: FetchBaseQueryError & {data: {message: string; code: string}}
) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const {data: userData, isFetching, refetch} = useGetUserInfoQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  
  // After successful login/register — refetch to get user data with new cookies
  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);
  
  useEffect(() => {
    if (userData) {
      dispatch(setUserInfo({...userData}));
      localStorage.setItem('isAuth', 'true');
      dispatch(getIsAuth());
      router.replace('/');
      return;
    }
    
    if (isFetching) return; // Still loading — keep the loader, don't conclude anything yet
    
    // Query finished with no data → user is not authenticated
    localStorage.setItem('isAuth', 'false');
    dispatch(getIsAuth());
    
    const isAuth = localStorage.getItem('isAuth');
    if (pathname === '/' && isAuth === 'false') {
      router.replace('/auth');
    }
    if (pathname === '/auth' || pathname === '/register') {
      dispatch(setIsAuthLoading(false));
    }
  }, [userData, isFetching, authError]);
};
