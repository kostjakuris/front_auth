import { useAppDispatch } from '../lib/hooks';
import { setIsAuth, setIsAuthLoading, setUserInfo } from '../lib/authSlice';
import { setChatMessage, setIsEditMessage } from '../lib/messagesSlice';
import { setCurrentRoom, setOwnerId, setRooms } from '../lib/roomsSlice';
import { setIsChat, setIsUsersList } from '../lib/uiSlice';
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
    dispatch(setCurrentRoom(null));
    dispatch(setOwnerId(null));
    dispatch(setIsEditMessage(false));
    dispatch(setIsUsersList(false));
    dispatch(setChatMessage(''));
    dispatch(setIsChat(false));
    dispatch(setIsAuth(false));
    router.push('/auth');
  };
  
  return {logout};
};
