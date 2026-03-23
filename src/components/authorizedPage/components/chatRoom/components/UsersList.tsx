'use client';
import React from 'react';
import styles from '../../../authorized.module.scss';
import usersListStyles from './usersList.module.scss';
import { useAppSelector } from '../../../../../lib/hooks';
import { Delete } from '../../../../../../public/images/Delete';
import { useGetCurrentRoomInfoQuery } from '../../../../../lib/roomApi';
import { getSocket } from '../../../../../api/socket';
import { useSocketEvents } from '../../../../../hooks/useSocketEvents';

const UsersList = () => {
  const {userInfo, currentRoom, currentRoomId, ownerId} = useAppSelector(
    state => state.auth);
  const {data: roomData, refetch} = useGetCurrentRoomInfoQuery(currentRoomId ? currentRoomId : '', {
    refetchOnMountOrArgChange: true,
  });
  const socket = getSocket();
  
  useSocketEvents();
  
  return (
    <div className={usersListStyles.user_list}>
      <p className={`${styles.authorized__chats_title} my-5 text-center`}>All users</p>
      {
        roomData?.users?.map((user: any) => (
          <div key={user.id} className={'flex items-center justify-between h-[60px]'}>
            <p className={`${styles.authorized__chats_title} ml-5`}>{userInfo?.userId !== user.id ? user.username :
              `Me(${user.username})`} {user.id === ownerId ? '(Admin)' : ''}</p>
            {
              userInfo?.userId === ownerId && userInfo?.userId !== user.id ?
                <button className={'cursor-pointer'}
                  onClick={() => {
                    socket.emit('kickUserFromRoom',
                      {roomName: currentRoom, roomId: currentRoomId, userId: user.id}
                    );
                    refetch();
                  }}>
                  <Delete />
                </button>
                : null
            }
          </div>
        ))
      }
    </div>
  );
};

export default UsersList;