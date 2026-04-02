'use client';
import React, { useEffect, useRef, useState } from 'react';
import roomsStyles from './roomsData.module.scss';
import { ContextMenu, ContextMenuButton } from '../../../ui/contextMenu';
import { ChatRoom, DeleteMessageModal } from '../../index';
import { useAppDispatch, useAppSelector } from '../../../../lib/hooks';
import { setChatMessage, setIsEditMessage } from '../../../../lib/messagesSlice';
import { setChosenRoom, setCurrentRoom, setIsEditRoom, setRooms, } from '../../../../lib/roomsSlice';
import { setIsChat, setIsUsersList } from '../../../../lib/uiSlice';
import { useContextMenu } from '../../../../hooks/useContextMenu';
import { getSocket } from '../../../../api/socket';
import { useGetAllRoomsQuery, useSearchRoomsQuery } from '../../../../lib/roomApi';
import { useModal } from '../../../../providers/ModalProvider/ModalProvider.hooks';
import { Edit } from '../../../../../public/images/Edit';
import { Delete } from '../../../../../public/images/Delete';
import { Input } from '../../../ui/input';
import sendStyles from '../../../ui/sendComponent/sendComponent.module.scss';
import Search from '../../../../../public/images/Search';
import Settings from '../../../../../public/images/Settings';
import { Create } from '../../../../../public/images/Create';
import Logout from '../../../../../public/images/Logout';
import CreateAndEditRoomModal from '../chat/modals/CreateAndEditRoomModal';
import RoomItem from './components/RoomItem';
import { useLogout } from '../../../../hooks/useLogout';
import { useSocketEvents } from '../../../../hooks/useSocketEvents';
import { Room } from '../../../../interfaces/form.interface';

const RoomsData = () => {
  const dispatch = useAppDispatch();
  const {userInfo, isAuth} = useAppSelector(state => state.auth);
  const {currentRoom, rooms, chosenRoom} = useAppSelector(state => state.rooms);
  const {isChat} = useAppSelector(state => state.ui);
  const {data} = useGetAllRoomsQuery(undefined, {skip: !isAuth, refetchOnMountOrArgChange: true});
  const {openModal} = useModal();
  const [text, setText] = useState('');
  const {data: searchResults} = useSearchRoomsQuery(text, {skip: text.length < 1});
  const {logout} = useLogout();
  const containerRef = useRef<HTMLDivElement>(null);
  const {contextMenu, handleContextMenu, closeContextMenu} = useContextMenu();
  
  const onRoomContextMenu = (
    event: React.MouseEvent<HTMLDivElement>,
    room: Room
  ) => {
    handleContextMenu(event, room.name, {dynamicPosition: true, isSettings: false});
    dispatch(setChosenRoom({...room}));
  };
  
  const openRoom = (room: Room, event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (event.button !== 0) return;
    setText('');
    dispatch(setCurrentRoom({...room}));
    dispatch(setIsEditMessage(false));
    dispatch(setIsUsersList(false));
    dispatch(setChatMessage(''));
    const socket = getSocket();
    if (!room.username) {
      socket.emit('joinRoom', {roomName: room.name});
    }
    dispatch(setIsChat(true));
  };
  
  const isOwner = userInfo?.userId === currentRoom?.ownerId || userInfo?.userId === chosenRoom?.ownerId;
  
  const roomButtons: ContextMenuButton[] = (isOwner || chosenRoom?.type === 'direct') && !contextMenu.isSettings
    ? [
      ...(chosenRoom?.type === 'public' ? [{
        label: 'Edit',
        icon: <Edit className={'w-[20px] h-[20px] mr-2 mb-0.5'} />,
        onClick: () => {
          dispatch(setIsEditRoom(true));
          openModal(<CreateAndEditRoomModal />);
          closeContextMenu();
        },
      }] : []),
      {
        label: 'Delete',
        icon: <Delete className={'w-[20px] h-[20px] mr-2 mb-0.5'} />,
        onClick: () => {
          openModal(<DeleteMessageModal location='room' contextMenu={contextMenu} />);
          closeContextMenu();
        },
      },
    ]
    : [];
  
  const settingsButtons: ContextMenuButton[] = contextMenu.isSettings
    ? [
      {
        label: 'Logout',
        icon: <Logout className={'w-[25px] h-[25px] fill-white mr-2 mb-0.5'} />,
        onClick: () => logout(),
      },
      {
        label: 'Create room',
        icon: <Create className={'w-[25px] h-[25px] mr-2 mb-0.5'} />,
        onClick: () => {
          dispatch(setIsEditRoom(false));
          dispatch(setChosenRoom(null));
          openModal(<CreateAndEditRoomModal />);
        },
      },
    ]
    : [];
  
  const roomsToDisplay = text.length >= 1 ? searchResults : rooms;
  
  useSocketEvents();
  
  useEffect(() => {
    if (data) {
      dispatch(setRooms(data));
    }
  }, [data]);
  
  return (
    <div
      onClick={() => contextMenu.visible && closeContextMenu()}
      onContextMenu={() => contextMenu.visible && closeContextMenu()}
      className={roomsStyles.chat_container}
    >
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
            <button
              className={'cursor-pointer'}
              onClick={(e) => {
                e.stopPropagation();
                handleContextMenu(e, '', {dynamicPosition: false, isSettings: true});
              }}
            >
              <Settings />
            </button>
            <ContextMenu contextMenu={contextMenu} buttons={settingsButtons} closeContextMenu={closeContextMenu} />
          </div>
        </div>
        <div className={roomsStyles.chat__scrollContainer} ref={containerRef}>
          {roomsToDisplay?.length === 0 ? (
            <div className={'h-full flex items-center justify-center flex-1'}>
              <p className={'text-center text-[16px] text-white mt-5 font-medium text-xl'}>
                Please create new room to start messaging!
              </p>
            </div>
          ) : (
            roomsToDisplay?.map((room) => (
              <RoomItem
                key={room.id}
                room={room}
                isActive={currentRoom?.id === room.id}
                onContextMenu={onRoomContextMenu}
                onMouseDown={(event) => openRoom(room,
                  event
                )}
              />
            ))
          )}
          <ContextMenu containerRef={containerRef} contextMenu={contextMenu} buttons={roomButtons}
            closeContextMenu={closeContextMenu} />
        </div>
      </div>
      {isChat ? (
        <ChatRoom />
      ) : (
        <div className={'h-full flex items-center justify-center flex-1'}>
          <p className={'text-center text-[16px] text-white mt-5 font-medium text-xl'}>
            Please select a chat to start messaging!
          </p>
        </div>
      )}
    </div>
  );
};

export default RoomsData;
