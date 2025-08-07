'use client';

import { setIsChat, setIsRooms, setIsUsersList } from '../lib/slice';
import { useAppDispatch, useAppSelector } from '../lib/hooks';

export const useCloseRoom = () => {
  const dispatch = useAppDispatch();
  const {isUsersList} = useAppSelector(
    state => state.auth);
  const closeRoom = () => {
    if (isUsersList) {
      dispatch(setIsUsersList(false));
    } else {
      dispatch(setIsRooms(true));
      dispatch(setIsChat(false));
    }
  };
  return {
    closeRoom,
  };
};
