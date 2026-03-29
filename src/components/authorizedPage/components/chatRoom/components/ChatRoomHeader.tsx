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
    <div className={'flex justify-between items-center pb-[26px] pt-[30px] px-[30px]'}>
      <div className={'flex items-center gap-2'}>
        <Back fill={'#2242b4'} className={'drop-shadow-[0_0_3px_#2242b4]'} onClickFn={closeRoom} />
        <p className={`${styles.authorized__chats_title} text-center w-full ml-[10px]`}>{currentRoom}</p>
      </div>
      <div className={'relative'}>
        <button className={'cursor-pointer'}
          onClick={(e) => handleContextMenu(e, '', {x: 5, y: 20, dynamicPosition: false})}>
          <Menu fill={'#2242b4'} className={'drop-shadow-[0_0_3px_#2242b4]'} />
        </button>
        <ContextMenu contextMenu={contextMenu} buttons={headerButtons} closeContextMenu={closeContextMenu} />
      </div>
    </div>
  );
};

export default ChatRoomHeader;
