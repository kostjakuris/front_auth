import React, { FC } from 'react';
import styles from '../../../authorized.module.scss';
import Back from '../../../../../../public/images/Back';
import Menu from '../../../../../../public/images/Menu';
import { useCloseRoom } from '../../../../../hooks/useCloseRoom';
import { useAppDispatch, useAppSelector } from '../../../../../lib/hooks';
import { setIsUsersList } from '../../../../../lib/slice';

interface ChatRoomHeaderProps {
  isChatMenu: boolean;
  setIsChatMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatRoomHeader: FC<ChatRoomHeaderProps> = ({isChatMenu, setIsChatMenu}) => {
  const {closeRoom} = useCloseRoom();
  const dispatch = useAppDispatch();
  const {currentRoom} = useAppSelector(
    state => state.auth);
  
  const openUsersList = (event: any) => {
    event.stopPropagation();
    dispatch(setIsUsersList(true));
    setIsChatMenu(false);
  };
  return (
    <div className={'flex justify-between items-center pl-5 my-5'}>
      <Back onClickFn={closeRoom} />
      <p className={`${styles.authorized__chats_title} text-center w-full pr-10`}>{currentRoom}</p>
      <div className={'relative'}>
        <button className={'mr-3 cursor-pointer'}
          onClick={() => setIsChatMenu((prev: boolean) => !prev)}>
          <Menu />
        </button>
        <div className={!isChatMenu ? 'hidden' : styles.authorized__chat_ownerMenu}>
          <button
            onClick={(event) => openUsersList(event)}
            className={styles.authorized__chat_btn}>
            All users
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomHeader;