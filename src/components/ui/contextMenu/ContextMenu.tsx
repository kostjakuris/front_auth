'use client';
import React, { FC, useEffect, useRef } from 'react';
import styles from '../../authorizedPage/authorized.module.scss';
import { Edit } from '../../../../public/images/Edit';
import { Delete } from '../../../../public/images/Delete';
import Copy from '../../../../public/images/Copy';
import { setChatMessage, setIsCreateRoom, setIsEditMessage } from '../../../lib/slice';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks';
import { useModal } from '../../../providers/ModalProvider/ModalProvider.hooks';
import { DeleteMessageModal } from '../../authorizedPage';

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
  closeContextMenu: () => void;
  setRoomName?: (roomName: string) => void;
}

const ContextMenu: FC<MenuProps> = ({contextMenu, location, setRoomName, closeContextMenu}) => {
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
  const menuRef = useRef<HTMLDivElement>(null);
  const menuWidth = menuRef.current?.getBoundingClientRect().width || 200;
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeContextMenu();
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  if (!contextMenu.visible && !menuRef.current) {
    return null;
  }
  
  return (
    <div
      ref={menuRef}
      className={styles.authorized__chat_menu}
      style={{
        overflow: 'hidden',
        top: contextMenu.y,
        left: contextMenu.x - menuWidth,
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
            <button onClick={() => {
              openModal(
                <DeleteMessageModal
                  location={location}
                  contextMenu={contextMenu}
                />
              );
              closeContextMenu();
            }}
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