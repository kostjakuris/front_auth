'use client';
import React, { useState } from 'react';
import styles from '../../authorized.module.scss';
import roomsStyles from './roomsData.module.scss';
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
import { roomApi, useGetAllRoomsQuery, useSearchRoomsQuery } from '../../../../lib/roomApi';
import { useModal } from '../../../../providers/ModalProvider/ModalProvider.hooks';
import { Edit } from '../../../../../public/images/Edit';
import { Delete } from '../../../../../public/images/Delete';
import { useLazyLogoutQuery } from '../../../../lib/authApi';
import { userApi } from '../../../../lib/userApi';
import { useRouter } from 'next/navigation';
import CreateAndEditRoomModal from '../chat/modals/CreateAndEditRoomModal';
import { Input } from '../../../ui/input';
import sendStyles from '../../../ui/sendComponent/sendComponent.module.scss';
import Search from '../../../../../public/images/Search';
import Settings from '../../../../../public/images/Settings';
import { Create } from '../../../../../public/images/Create';
import Logout from '../../../../../public/images/Logout';


const RoomsData = () => {
  const dispatch = useAppDispatch();
  const {currentRoomId, userInfo, isChat, ownerId, isAuth, chosenOwnerId} = useAppSelector(
    state => state.auth);
  const {data} = useGetAllRoomsQuery(undefined, {skip: !isAuth, refetchOnMountOrArgChange: true});
  const {openModal} = useModal();
  const router = useRouter();
  const [text, setText] = useState('');
  const {data: searchResults} = useSearchRoomsQuery(text, {skip: text.length <= 0});
  
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
    
    handleContextMenu(event, name, {dynamicPosition: true, isSettings: false});
    
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
  
  const roomButtons: ContextMenuButton[] = isOwner && !contextMenu.isSettings ? [
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
    dispatch(roomApi.util.resetApiState());
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
  
  const roomsToDisplay = text.length > 1 ? searchResults : data;
  
  const settingsButtons: ContextMenuButton[] = contextMenu.isSettings ? [
    {
      label: 'Logout',
      icon: <Logout className={'w-[30px] h-[30px] fill-white mr-2 mb-0.5'} />,
      onClick: () => logoutFn(),
    },
    {
      label: 'Create room',
      icon: <Create className={'w-[30px] h-[30px] mr-2 mb-0.5'} />,
      onClick: () => {
        dispatch(setIsEditRoom(false));
        openModal(<CreateAndEditRoomModal />);
      },
    },
  ] : [];
  
  return (
    <div
      onClick={() => contextMenu.visible && closeContextMenu()}
      onContextMenu={() => contextMenu.visible && closeContextMenu()}
      className={roomsStyles.chat_container}>
      <div className={roomsStyles.chat__rooms}>
        <div className={'flex items-center justify-end gap-[15px] px-[15px] mb-[25px] sticky top-0 z-10 left-0'}>
          <div className={'relative w-full'}>
            <span className={'absolute top-[10px] left-0'}>
              <Search />
            </span>
            <Input
              isErrorHidden
              name='message'
              placeholder='Search'
              type={'text'}
              value={text}
              onChangeFn={(event) => setText(event.target.value)}
              class_name={`${sendStyles.input} px-[35px]!`}
            />
          </div>
          <div className={'relative'}>
            <button className={'cursor-pointer'}
              onClick={(e) => {
              e.stopPropagation();
              handleContextMenu(e, '', {x: 5, y: 20, dynamicPosition: false, isSettings: true});
            }}>
              <Settings />
            </button>
            <ContextMenu contextMenu={contextMenu} buttons={settingsButtons} closeContextMenu={closeContextMenu} />
          </div>
        </div>
        <div className={roomsStyles.chat__scrollContainer}>
          {
            roomsToDisplay?.length === 0 ?
              <div className={'h-full flex items-center justify-center flex-1'}>
                <p className={'text-center text-[16px] text-white mt-5 font-medium text-xl'}>Please create new room to start
                  messaging!</p>
              </div> :
              roomsToDisplay?.map((element: any) => (
                <div key={element.id}
                  onContextMenu={(event) => onRoomContextMenu(event, element.id, element.name, element.ownerId)}
                  className={`${roomsStyles.chats_room} ${currentRoomId === String(element.id) ?
                    roomsStyles.chat__active : ''}`}
                  onMouseDown={(event) => openRoom(element.id, element.name, element.ownerId, event)}>
                  <p className={styles.authorized__chats_title}>{element.name}</p>
                </div>
              ))
          }
          <ContextMenu contextMenu={contextMenu} buttons={roomButtons} closeContextMenu={closeContextMenu} />
        </div>
      </div>
      {isChat ? <ChatRoom /> :
        <div className={'h-full flex items-center justify-center flex-1'}>
          <p className={'text-center text-[16px] text-white mt-5 font-medium text-xl'}>Please select a chat to start messaging!</p>
        </div>}
    </div>
  );
};

export default RoomsData;
