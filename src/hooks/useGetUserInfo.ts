'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { setIsAuth, setIsAuthLoading, setUserInfo } from '../lib/authSlice';
import { useGetUserInfoQuery } from '../lib/userApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const useGetUserInfo = (
  isSuccess?: boolean,
  authError?: FetchBaseQueryError & {data: {message: string; code: string}}
) => {
  const dispatch = useAppDispatch();
  const {isAuth} = useAppSelector(state => state.auth);

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
      dispatch(setIsAuth(true));
      router.replace('/');
      return;
    }
    
    if (isFetching) return; // Still loading — keep the loader, don't conclude anything yet
    
    // Query finished with no data → user is not authenticated
    dispatch(setIsAuth(false));
    
    if (pathname === '/' && !isAuth) {
      router.replace('/auth');
    }
    if (pathname === '/auth' || pathname === '/register') {
      dispatch(setIsAuthLoading(false));
    }
  }, [userData, isFetching, authError]);
};
