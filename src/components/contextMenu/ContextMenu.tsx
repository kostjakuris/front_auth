import React, { FC } from 'react';
import styles from '../authorizedPage/authorized.module.scss';
import { Edit } from '../../../public/images/Edit';
import { Delete } from '../../../public/images/Delete';
import Copy from '../../../public/images/Copy';
import { setChatMessage, setIsCreateRoom, setIsEditMessage } from '../../lib/slice';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { useModal } from '../../providers/ModalProvider/ModalProvider.hooks';
import { DeleteMessageModal } from '../authorizedPage';

export interface MenuProps {
  contextMenu: {
    visible: boolean,
    x: number,
    y: number,
    messageText: string,
    type?: string,
    fullPath?: string,
  };
  location: 'room' | 'message';
  setRoomName?: (roomName: string) => void;
}

const ContextMenu: FC<MenuProps> = ({contextMenu, location, setRoomName}) => {
  const dispatch = useAppDispatch();
  
  const {openModal} = useModal();
  const {ownerId, userId, messageUserId} = useAppSelector((state) => state.auth);
  const editMessage = () => {
    if (location === 'message') {
      dispatch(setChatMessage(contextMenu.messageText));
      dispatch(setIsEditMessage(true));
    } else {
      setRoomName?.(contextMenu.messageText);
      dispatch(setIsCreateRoom(true));
    }
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
        (userId === Number(messageUserId) || userId === ownerId) && (
          <>
            {
              (location !== 'message' || contextMenu.type === 'text') && (
                <button onClick={editMessage} className={styles.authorized__chat_btn}>
                  <Edit class_name={'w-[20px] h-[20px] mr-2 mb-0.5'} />
                  Edit
                </button>
              )
            }
            <button onClick={() => openModal(
              <DeleteMessageModal
                location={location}
                contextMenu={contextMenu}
              />)}
              className={styles.authorized__chat_btn}>
              <Delete class_name={'w-[20px] h-[20px] mr-2 mb-0.5'} />
              Delete
            </button>
          </>
        )
      }
      {
        location === 'message' && contextMenu.type === 'text' &&
        <button onClick={() => navigator.clipboard.writeText(contextMenu.messageText)}
          className={styles.authorized__chat_btn}>
          <Copy class_name={'mr-2 mb-0.5'} />
          Copy text
        </button>
      }
      {
        location === 'message' && contextMenu.type !== 'text' &&
        <button
          className={styles.authorized__chat_btn}>
          <Copy class_name={'mr-2 mb-0.5'} />
          Copy {contextMenu.type}
        </button>
      }
    </div>
  );
};

export default ContextMenu;