'use client';
import React from 'react';
import styles from '../../../authorized.module.scss';
import Back from '../../../../../../public/images/Back';
import Menu from '../../../../../../public/images/Menu';
import { useCloseRoom } from '../../../../../hooks/useCloseRoom';
import { useAppDispatch, useAppSelector } from '../../../../../lib/hooks';
import { setIsUsersList } from '../../../../../lib/uiSlice';
import { useContextMenu } from '../../../../../hooks/useContextMenu';
import ContextMenu, { ContextMenuButton } from '../../../../ui/contextMenu/ContextMenu';

const ChatRoomHeader = () => {
  const {closeRoom} = useCloseRoom();
  const dispatch = useAppDispatch();
  const {currentRoom} = useAppSelector(state => state.rooms);
  const {userInfo} = useAppSelector(state => state.auth);
  
  const roomFirstLetter = currentRoom?.name ? currentRoom.name.slice(0, 1).toUpperCase() :
    currentRoom?.username?.slice(0, 1).toUpperCase();
  const roomLastLetter = currentRoom?.name ?
    currentRoom.name.slice(currentRoom.name.length - 1, currentRoom.name.length).toUpperCase() : '';
  
  const {contextMenu, handleContextMenu, closeContextMenu} = useContextMenu();
  
  const headerButtons: ContextMenuButton[] = [
    {
      label: 'All users',
      onClick: () => {
        dispatch(setIsUsersList(true));
        closeContextMenu();
      },
    },
  ];
  
  const roomName = currentRoom?.type === 'public' ? currentRoom.name :
    currentRoom?.users?.find(user => user.id !== userInfo?.userId)?.username;
  
  return (
    <div className={'flex justify-between items-center pb-[18px] pt-[20px] px-[30px]'}>
      <div className={'flex items-center gap-[18px]'}>
        <Back fill={'#2242b4'} className={'drop-shadow-[0_0_3px_#2242b4]'} onClickFn={closeRoom} />
        {
          currentRoom?.avatar && currentRoom?.avatar !== 'undefined' ?
            <img className={'rounded-full object-cover h-[50px] w-[50px]'} src={currentRoom.avatar}
              alt={currentRoom.avatar} /> :
            <span className={'rounded-full bg-[#343144] flex justify-center items-center h-[50px] w-[50px]'}>
            {roomFirstLetter}{roomLastLetter}
          </span>
        }
        <p className={`${styles.authorized__chats_title} text-center w-fit`}>{roomName ?? currentRoom?.username}</p>
      </div>
      <div className={'relative'}>
        <button className={'cursor-pointer'}
          onClick={(e) => handleContextMenu(e, '', {dynamicPosition: false})}>
          <Menu fill={'#2242b4'} className={'drop-shadow-[0_0_3px_#2242b4]'} />
        </button>
        <ContextMenu contextMenu={contextMenu} buttons={headerButtons} closeContextMenu={closeContextMenu} />
      </div>
    </div>
  );
};

export default ChatRoomHeader;
