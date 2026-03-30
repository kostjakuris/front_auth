import React from 'react';
import styles from '../../../authorized.module.scss';
import roomsStyles from '../roomsData.module.scss';
import { Room } from '../../../../../interfaces/form.interface';
import LastMessagePreview from './LastMessagePreview';

interface RoomItemProps {
  room: Room;
  isActive: boolean;
  onContextMenu: (event: React.MouseEvent<HTMLDivElement>, id: number, name: string, ownerId: number) => void;
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const RoomItem = ({ room, isActive, onContextMenu, onMouseDown }: RoomItemProps) => (
  <div
    onContextMenu={(e) => onContextMenu(e, room.id, room.name, room.ownerId)}
    className={`${roomsStyles.chats_room} ${isActive ? roomsStyles.chat__active : ''}`}
    onMouseDown={onMouseDown}
  >
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
);

export default RoomItem;
