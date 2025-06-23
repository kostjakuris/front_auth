import React, { FC } from 'react';
import styles from '../authorizedPage/authorized.module.scss';
import { Edit } from '../../../public/images/Edit';
import { Delete } from '../../../public/images/Delete';
import Copy from '../../../public/images/Copy';
import { setChatMessage, setIsCreateRoom, setIsEditMessage } from '../../lib/slice';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { getSocket } from '../../api/socket';
import { useDeleteRoomMutation } from '../../lib/roomApi';

interface MenuProps {
  contextMenu: {
    visible: boolean,
    x: number,
    y: number,
    messageText: string,
  };
  location: 'room' | 'message';
  messageId?: string;
  messageUserId?: string;
  setRoomName?: (roomName: string) => void;
}

const ContextMenu: FC<MenuProps> = ({contextMenu, messageId, messageUserId, location, setRoomName}) => {
  const dispatch = useAppDispatch();
  const [deleteRoom] = useDeleteRoomMutation();
  const socket = getSocket();
  const {currentRoom, ownerId, userId, currentRoomId} = useAppSelector((state) => state.auth);
  const editMessage = () => {
    if (location === 'message') {
      dispatch(setChatMessage(contextMenu.messageText));
      dispatch(setIsEditMessage(true));
    } else {
      setRoomName?.(contextMenu.messageText);
      dispatch(setIsCreateRoom(true));
    }
  };
  
  const deleteOneMessage = () => {
    socket.emit('deleteMessage', {
      messageUserId,
      ownerId,
      userId,
      messageId,
      roomName: currentRoom,
    });
  };
  
  const deleteOneRoom = async() => {
    await deleteRoom({id: Number(currentRoomId), ownerId: Number(ownerId)});
  };
  return (
    <div
      className={!contextMenu.visible ? 'hidden' : styles.authorized__chat_menu}
      style={{
        position: 'absolute',
        top: contextMenu.y,
        left: contextMenu.x,
      }}>
      {
        userId === Number(messageUserId) || userId === ownerId ?
          <>
            <button onClick={editMessage} className={styles.authorized__chat_btn}>
              <Edit class_name={'w-[20px] h-[20px] mr-2 mb-0.5'} />
              Edit
            </button>
            <button onClick={location === 'message' ? deleteOneMessage : deleteOneRoom}
              className={styles.authorized__chat_btn}>
              <Delete class_name={'w-[20px] h-[20px] mr-2 mb-0.5'} />
              Delete
            </button>
          </>
          :
          null
      }
      {
        location === 'message' ?
          <button onClick={() => navigator.clipboard.writeText(contextMenu.messageText)}
            className={styles.authorized__chat_btn}>
            <Copy class_name={'mr-2 mb-0.5'} />
            Copy text
          </button>
          : null
      }
    </div>
  );
};

export default ContextMenu;