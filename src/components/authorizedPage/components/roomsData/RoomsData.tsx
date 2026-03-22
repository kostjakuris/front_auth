'use client';
import React from 'react';
import styles from '../../authorized.module.scss';
import { ContextMenu, ContextMenuButton } from '../../../ui/contextMenu';
import { ChatRoom, DeleteMessageModal } from '../../index';
import { useAppDispatch, useAppSelector } from '../../../../lib/hooks';
import {
  getIsAuth,
  setChatMessage,
  setChosenOwnerId,
  setChosenRoom,
  setChosenRoomId,
  setCurrentRoom,
  setCurrentRoomId,
  setIsAuthLoading,
  setIsChat,
  setIsEditMessage,
  setIsEditRoom,
  setIsUsersList,
  setOwnerId,
  setUserInfo
} from '../../../../lib/slice';
import { useContextMenu } from '../../../../hooks/useContextMenu';
import { getSocket } from '../../../../api/socket';
import { useGetAllRoomsQuery } from '../../../../lib/roomApi';
import { useModal } from '../../../../providers/ModalProvider/ModalProvider.hooks';
import { Edit } from '../../../../../public/images/Edit';
import { Delete } from '../../../../../public/images/Delete';
import { useLazyLogoutQuery } from '../../../../lib/authApi';
import { userApi } from '../../../../lib/userApi';
import { useRouter } from 'next/navigation';
import Logout from '../../../../../public/images/Logout';
import { Create } from '../../../../../public/images/Create';
import CreateAndEditRoomModal from '../chat/modals/CreateAndEditRoomModal';


const RoomsData = () => {
  const dispatch = useAppDispatch();
  const {currentRoomId, userInfo, isChat, ownerId, chosenOwnerId} = useAppSelector(
    state => state.auth);
  const {data} = useGetAllRoomsQuery(undefined, {refetchOnMountOrArgChange: true});
  const {openModal} = useModal();
  const router = useRouter();
  
  const {
    contextMenu,
    handleContextMenu,
    closeContextMenu
  } = useContextMenu();
  const onRoomContextMenu = (
    event: React.MouseEvent<HTMLDivElement>,
    roomId: number,
    name: string,
    roomOwnerId: number
  ) => {
    
    handleContextMenu(event, name, {dynamicPosition: true});
    
    dispatch(setChosenRoomId(String(roomId)));
    dispatch(setChosenOwnerId(roomOwnerId));
    dispatch(setChosenRoom(name));
  };
  
  const openRoom = (id: number, name: string, roomOwnerId: number, event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (event.button !== 0) return;
    
    dispatch(setCurrentRoomId(String(id)));
    dispatch(setCurrentRoom(name));
    dispatch(setOwnerId(roomOwnerId));
    dispatch(setIsEditMessage(false));
    dispatch(setIsUsersList(false));
    dispatch(setChatMessage(''));
    const socket = getSocket();
    socket.emit('joinRoom', {
      roomName: name,
      roomId: id,
      userId: userInfo?.userId,
    });
    dispatch(setIsChat(true));
  };
  
  const isOwner = userInfo?.userId === ownerId || userInfo?.userId === chosenOwnerId;
  
  const roomButtons: ContextMenuButton[] = isOwner ? [
    {
      label: 'Edit',
      icon: <Edit className={'w-[20px] h-[20px] mr-2 mb-0.5'} />,
      onClick: () => {
        dispatch(setIsEditRoom(true));
        openModal(<CreateAndEditRoomModal />);
        closeContextMenu();
      },
    },
    {
      label: 'Delete',
      icon: <Delete className={'w-[20px] h-[20px] mr-2 mb-0.5'} />,
      onClick: () => {
        openModal(<DeleteMessageModal location='room' contextMenu={contextMenu} />);
        closeContextMenu();
      },
    },
  ] : [];
  
  
  const [logout] = useLazyLogoutQuery();
  
  const logoutFn = async() => {
    dispatch(setIsAuthLoading(true));
    await logout('');
    dispatch(userApi.util.resetApiState());
    dispatch(setUserInfo(null));
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
  
  
  return (
    <div
      onClick={() => contextMenu.visible && closeContextMenu()}
      onContextMenu={() => contextMenu.visible && closeContextMenu()}
      className={styles.authorized__chat_container}>
      <div className={styles.authorized__chat_rooms}>
        <div className={'flex items-center justify-end gap-[15px] sticky top-0 z-10 left-0'}>
          <button className={styles.authorized__button} onClick={logoutFn}>
            <Logout className={'fill-white'} />
          </button>
          <button className={styles.authorized__button} onClick={() => {
            dispatch(setIsEditRoom(false));
            openModal(<CreateAndEditRoomModal />);
          }}>
            <Create />
          </button>
        </div>
        {
          data?.length === 0 ?
            <div className={'h-full flex items-center justify-center flex-1'}>
              <p className={'text-center text-white mt-5 font-medium text-xl'}>Please create new room to start
                messaging!</p>
            </div> :
            data?.map((element: any) => (
              <div key={element.id}
                onContextMenu={(event) => onRoomContextMenu(event, element.id, element.name, element.ownerId)}
                className={`${styles.authorized__chats_room} ${currentRoomId === String(element.id) ? 'bg-[#808080FF]' :
                  ''}`}
                onMouseDown={(event) => openRoom(element.id, element.name, element.ownerId, event)}>
                <p className={styles.authorized__chats_title}>{element.name}</p>
              </div>
            ))
        }
        <ContextMenu contextMenu={contextMenu} buttons={roomButtons} closeContextMenu={closeContextMenu} />
      </div>
      {isChat ? <ChatRoom /> :
        <div className={'h-full flex items-center justify-center flex-1'}>
          <p className={'text-center text-white mt-5 font-medium text-xl'}>Please select a chat to start messaging!</p>
        </div>}
    </div>
  );
};

export default RoomsData;
