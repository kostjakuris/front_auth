'use client';
import React from 'react';
import styles from '../../authorized.module.scss';
import chatStyles from './chatRoom.module.scss';
import { useAppSelector } from '../../../../lib/hooks';
import { useGetAllMessagesQuery, useIsUserJoinedQuery, } from '../../../../lib/roomApi';
import { SendComponent } from '../../../ui/sendComponent';
import { getSocket } from '../../../../api/socket';
import UsersList from './components/UsersList';
import RoomMessages from './components/RoomMessages';
import ChatRoomHeader from './components/ChatRoomHeader';
import { FadeLoader } from 'react-spinners';


const ChatRoom = () => {
  const {userInfo, currentRoom, currentRoomId, isChat, isUsersList} = useAppSelector(
    state => state.auth);
  const {isLoading} = useGetAllMessagesQuery(currentRoomId ? currentRoomId : '', {
    refetchOnMountOrArgChange: true
  });
  const {data: isUserJoin} = useIsUserJoinedQuery(currentRoomId ? currentRoomId : '');
  const socket = getSocket();
  
  if (isLoading) {
    return (
      <div className={!isChat ? 'hidden' : chatStyles.chat}>
        <div className={'h-full flex items-center justify-center'}>
          <FadeLoader color={'white'} loading={true} />
        </div>
      </div>
    );
  }
  
  return (
    <div
      className={!isChat ? 'hidden' : chatStyles.chat}>
      <ChatRoomHeader />
      <div className={'w-full h-[8px] bg-[#292634] border-t-[2px] border-b-[2px] border-[#221f2d]'} />
      {
        isUsersList ?
          <UsersList />
          :
          <RoomMessages />
      }
      {
        (!isUsersList && isUserJoin === 'true') ?
          <>
            <SendComponent />
          </>
          :
          <div className={isUsersList ? 'hidden' : 'block mb-5 mx-auto'}>
            <button className={styles.authorized__button}
              style={{background: '#9890e3', padding: '10px 20px'}}
              onClick={() => socket.emit('joinRoom',
                {roomName: currentRoom, roomId: currentRoomId, userId: userInfo?.userId},
              )}>
              Join a room
            </button>
          </div>
      }
    </div>
  );
};

export default ChatRoom;