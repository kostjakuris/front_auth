import React, { FC } from 'react';
import styles from '../authorizedPage/authorized.module.scss';
import { Edit } from '../../../public/images/Edit';
import { Delete } from '../../../public/images/Delete';
import Copy from '../../../public/images/Copy';
import { setChatMessage, setIsEditMessage } from '../../lib/slice';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { getSocket } from '../../api/socket';

interface MenuProps {
  contextMenu: {
    visible: boolean,
    x: number,
    y: number,
    messageText: string,
  };
  messageId: string;
}

const ContextMenu: FC<MenuProps> = ({contextMenu, messageId}) => {
  const dispatch = useAppDispatch();
  const socket = getSocket();
  const {currentRoom} = useAppSelector((state) => state.auth);
  
  
  const editMessage = () => {
    dispatch(setChatMessage(contextMenu.messageText));
    dispatch(setIsEditMessage(true));
  };
  
  const deleteOneMessage = () => {
    socket.emit('deleteMessage', {
      messageId,
      roomName: currentRoom,
    });
  };
  return (
    <div
      className={!contextMenu.visible ? 'hidden' : styles.authorized__chat_menu}
      style={{
        position: 'absolute',
        top: contextMenu.y,
        left: contextMenu.x,
      }}>
      <button onClick={editMessage} className={styles.authorized__chat_btn}>
        <Edit class_name={'w-[20px] h-[20px] mr-2 mb-0.5'} />
        Edit
      </button>
      <button onClick={deleteOneMessage} className={styles.authorized__chat_btn}>
        <Delete class_name={'w-[20px] h-[20px] mr-2 mb-0.5'} />
        Delete
      </button>
      <button onClick={() => navigator.clipboard.writeText(contextMenu.messageText)}
        className={styles.authorized__chat_btn}>
        <Copy class_name={'mr-2 mb-0.5'} />
        Copy text
      </button>
    </div>
  );
};

export default ContextMenu;