import React, { FC } from 'react';
import styles from '../authorizedPage/authorized.module.scss';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import Send from '../../../public/images/Send';
import Input from '../input/Input';
import Close from '../../../public/images/Close';
import { setChatMessage, setIsEditMessage } from '../../lib/slice';
import { getSocket } from '../../api/socket';

interface SendProps {
  messages: any[];
  messageId: string;
  messageUserId: string;
}

const SendComponent: FC<SendProps> = ({messages, messageId, messageUserId}) => {
  const dispatch = useAppDispatch();
  const {isEditMessage} = useAppSelector(state => state.auth);
  const {userName, userId, currentRoomId, currentRoom, chatMessage, ownerId} = useAppSelector((state) => state.auth);
  const socket = getSocket();
  
  const closeEditBlock = () => {
    dispatch(setChatMessage(''));
    dispatch(setIsEditMessage(false));
  };
  
  const submitMessage = (event: any) => {
    event.preventDefault();
    if (chatMessage) {
      if (!isEditMessage) {
        socket.emit('sendMessage', {
          userId,
          roomName: currentRoom,
          roomId: Number(currentRoomId),
          content: chatMessage,
          username: userName,
        });
      } else {
        socket.emit('editMessage', {
          messageUserId,
          ownerId,
          messageId,
          userId,
          roomName: currentRoom,
          content: chatMessage,
          username: userName,
        });
      }
    }
    dispatch(setChatMessage(''));
    dispatch(setIsEditMessage(false));
    
  };
  
  
  return (
    <form onSubmit={submitMessage}
      className={`${styles.authorized__chat_form} ${messages.length === 0 ? 'mt-auto' : 'mt-5'}`}>
      <div className={!isEditMessage ? 'hidden' : styles.authorized__chat_edit}>
        <p className={`${styles.authorized__text} ml-5 mb-4`}>{chatMessage}</p>
        <button className={'mr-2 cursor-pointer'} onClick={closeEditBlock}><Close /></button>
      </div>
      <div className={'flex items-center justify-around w-full mb-5 px-5'}>
        <Input
          name='message'
          placeholder='Send message'
          type={'text'}
          value={chatMessage ? chatMessage : ''}
          onChangeFn={(event) => dispatch(setChatMessage(event.target.value))}
          class_name={styles.authorized__chat_input}
        />
        <button
          disabled={chatMessage ? chatMessage.length === 0 : true}
          className={styles.authorized__send}
          type='submit'>
          <Send />
        </button>
      </div>
    </form>
  );
};

export default SendComponent;