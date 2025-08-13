import React from 'react';
import styles from '../../../authorized.module.scss';
import { useAppSelector } from '../../../../../lib/hooks';
import { Delete } from '../../../../../../public/images/Delete';
import { useGetCurrentRoomInfoQuery } from '../../../../../lib/roomApi';
import { getSocket } from '../../../../../api/socket';

const UsersList = () => {
  const {userId, currentRoom, currentRoomId, ownerId} = useAppSelector(
    state => state.auth);
  const {data: roomData} = useGetCurrentRoomInfoQuery(currentRoomId ? currentRoomId : '');
  const socket = getSocket();
  
  
  return (
    <div className={styles.authorized__chat_userList}>
      <p className={`${styles.authorized__chats_title} my-5 text-center`}>All users</p>
      {
        roomData?.users?.map((user: any) => (
          <div key={user.id} className={'flex items-center justify-between h-[60px]'}>
            <p className={`${styles.authorized__chats_title} ml-5`}>{userId !== user.id ? user.username :
              `Me(${user.username})`}</p>
            {
              userId === ownerId && userId !== user.id ?
                <button className={'cursor-pointer h-10'}
                  onClick={() => socket.emit('kickUserFromRoom',
                    {roomName: currentRoom, roomId: currentRoomId, userId: user.id}
                  )}>
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