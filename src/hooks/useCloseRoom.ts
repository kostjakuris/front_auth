'use client';

import { setCurrentRoom } from '../lib/roomsSlice';
import { setIsChat, setIsRooms, setIsUsersList } from '../lib/uiSlice';
import { useAppDispatch, useAppSelector } from '../lib/hooks';

export const useCloseRoom = () => {
  const dispatch = useAppDispatch();
  const {isUsersList} = useAppSelector(state => state.ui);
  const closeRoom = () => {
    if (isUsersList) {
      dispatch(setIsUsersList(false));
    } else {
      dispatch(setIsRooms(true));
      dispatch(setIsChat(false));
      dispatch(setCurrentRoom(null));
    }
  };
  return {
    closeRoom,
  };
};
