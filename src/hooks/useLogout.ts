import { useAppDispatch } from '../lib/hooks';
import {
  getIsAuth,
  setChatMessage,
  setCurrentRoom,
  setCurrentRoomId,
  setIsAuthLoading,
  setIsChat,
  setIsEditMessage,
  setIsUsersList,
  setOwnerId,
  setRooms,
  setUserInfo,
} from '../lib/slice';
import { roomApi } from '../lib/roomApi';
import { userApi } from '../lib/userApi';
import { useLazyLogoutQuery } from '../lib/authApi';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logoutQuery] = useLazyLogoutQuery();
  
  const logout = async() => {
    dispatch(setIsAuthLoading(true));
    await logoutQuery('');
    dispatch(userApi.util.resetApiState());
    dispatch(roomApi.util.resetApiState());
    dispatch(setUserInfo(null));
    dispatch(setRooms([]));
    dispatch(setCurrentRoomId(null));
    dispatch(setCurrentRoom(null));
    dispatch(setOwnerId(null));
    dispatch(setIsEditMessage(false));
    dispatch(setIsUsersList(false));
    dispatch(setChatMessage(''));
    dispatch(setIsChat(false));
    localStorage.setItem('isAuth', 'false');
    dispatch(getIsAuth());
    router.push('/auth');
  };
  
  return {logout};
};
