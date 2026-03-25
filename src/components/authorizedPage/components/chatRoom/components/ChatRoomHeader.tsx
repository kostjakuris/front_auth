'use client';
import React from 'react';
import styles from '../../../authorized.module.scss';
import Back from '../../../../../../public/images/Back';
import Menu from '../../../../../../public/images/Menu';
import { useCloseRoom } from '../../../../../hooks/useCloseRoom';
import { useAppDispatch, useAppSelector } from '../../../../../lib/hooks';
import { setIsUsersList } from '../../../../../lib/slice';
import { useContextMenu } from '../../../../../hooks/useContextMenu';
import ContextMenu, { ContextMenuButton } from '../../../../ui/contextMenu/ContextMenu';

const ChatRoomHeader = () => {
  const {closeRoom} = useCloseRoom();
  const dispatch = useAppDispatch();
  const {currentRoom} = useAppSelector(
    state => state.auth);
  
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
  
  return (
    <div className={'flex justify-between items-center pl-[15px] my-5'}>
      <Back onClickFn={closeRoom} />
      <p className={`${styles.authorized__chats_title} text-center w-full pr-10`}>{currentRoom}</p>
      <div className={'relative'}>
        <button className={'mr-3 cursor-pointer'}
          onClick={(e) => handleContextMenu(e, '', {x: 5, y: 20, dynamicPosition: false})}>
          <Menu />
        </button>
        <ContextMenu contextMenu={contextMenu} buttons={headerButtons} closeContextMenu={closeContextMenu} />
      </div>
    </div>
  );
};

export default ChatRoomHeader;
