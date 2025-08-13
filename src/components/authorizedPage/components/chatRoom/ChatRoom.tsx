import React, { useState } from 'react';
import styles from '../../authorized.module.scss';
import { useAppSelector } from '../../../../lib/hooks';
import { useGetAllMessagesQuery, useIsUserJoinedQuery, } from '../../../../lib/roomApi';
import { FadeLoader } from 'react-spinners';
import ContextMenu from '../../../contextMenu/ContextMenu';
import { SendComponent } from '../../../sendComponent';
import { getSocket } from '../../../../api/socket';
import { useContextMenu } from '../../../../hooks/useContextMenu';
import UsersList from './components/UsersList';
import RoomMessages from './components/RoomMessages';
import ChatRoomHeader from './components/ChatRoomHeader';


const ChatRoom = () => {
  const [isChatMenu, setIsChatMenu] = useState(false);
  const {userId, currentRoom, currentRoomId, isChat, isUsersList} = useAppSelector(
    state => state.auth);
  const {isLoading} = useGetAllMessagesQuery(currentRoomId ? currentRoomId : '');
  const {data: isUserJoin} = useIsUserJoinedQuery(currentRoomId ? currentRoomId : '');
  const socket = getSocket();
  
  const {
    contextMenu,
    closeContextMenu,
  } = useContextMenu<{
    type: string;
    fullPath: string;
    messageId: string;
    userId: string;
  }>();
  
  
  const handleOnClick = () => {
    if (contextMenu.visible) {
      closeContextMenu();
    }
    if (isChatMenu) {
      setIsChatMenu(false);
    }
  };
  
  
  return (
    <div
      onClick={handleOnClick}
      onContextMenu={() => contextMenu.visible && closeContextMenu()}
      className={!isChat ? 'hidden' : styles.authorized__chat}>
      {
        isLoading ?
          <div className={'h-50 flex items-center justify-center'}>
            <FadeLoader color={'white'} loading={true} />
          </div>
          :
          <>
            <ChatRoomHeader isChatMenu={isChatMenu} setIsChatMenu={setIsChatMenu} />
            {
              isUsersList ?
                <UsersList />
                :
                <RoomMessages />
            }
            <ContextMenu
              contextMenu={contextMenu}
              location={'message'}
            />
            {
              !isUsersList && isUserJoin === 'true' ?
                <SendComponent />
                :
                <div className={'flex items-center justify-center mb-5'}>
                  <button className={styles.authorized__button}
                    onClick={() => socket.emit('joinRoom', {
                      roomName: currentRoom,
                      roomId: currentRoomId,
                      userId
                    })}>
                    Join a room
                  </button>
                </div>
            }
          </>
      }
    </div>
  );
};

export default ChatRoom;