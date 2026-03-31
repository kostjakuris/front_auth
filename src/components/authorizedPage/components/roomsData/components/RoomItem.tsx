'use client';
import React, { useState } from 'react';
import styles from '../../../authorized.module.scss';
import roomsStyles from '../roomsData.module.scss';
import { Room } from '../../../../../interfaces/form.interface';
import LastMessagePreview from './LastMessagePreview';

interface RoomItemProps {
  room: Room;
  isActive: boolean;
  onContextMenu: (event: React.MouseEvent<HTMLDivElement>, id: number, name: string, ownerId: number,
    avatar?: string) => void;
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const RoomItem = ({room, isActive, onContextMenu, onMouseDown}: RoomItemProps) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      onContextMenu={(e) => onContextMenu(e, room.id, room.name, room.ownerId, room.avatar)}
      className={`${roomsStyles.chats_room} ${isActive ? roomsStyles.chat__active : ''}`}
      onMouseDown={onMouseDown}
    >
      <div className={'h-fit'}>
        {
          room.avatar ?
            <>
              {!loaded && (
                <div
                  className="h-[50px] w-[50px] rounded-full animate-pulse"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 75%)',
                    backgroundSize: '100%',
                  }}
                />
              )}
              <img
                onLoad={() => setLoaded(true)}
                onError={() => setLoaded(true)}
                className={`rounded-full object-cover h-[50px] w-[50px] ${loaded ? 'block' : 'hidden'}`}
                src={room.avatar}
                alt={room.avatar}
              />
            </> :
            <span className={'rounded-full bg-[#343144] flex justify-center items-center h-[50px] w-[50px]'}>
            {room.name.slice(0, 1).toUpperCase()}{room.name.slice(room.name.length - 1, room.name.length).toUpperCase()}
          </span>
        }
      </div>
      <div>
        <p className={styles.authorized__chats_title}>{room.name}</p>
        <div className={'text-white/50 text-[15px] mt-[6px] flex gap-[4px]'}>
          {room.lastMessage ? (
            <>
              <span>{room.lastMessage.username}:</span>
              <LastMessagePreview lastMessage={room.lastMessage} />
            </>
          ) : (
            <p>No messages yet!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomItem;
