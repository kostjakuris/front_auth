'use client';
import React from 'react';
import styles from '../../authorizedPage/authorized.module.scss';
import sendStyles from './sendComponent.module.scss';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks';
import Send from '../../../../public/images/Send';
import { Input } from '../input';
import Close from '../../../../public/images/Close';
import { setChatMessage, setIsEditMessage } from '../../../lib/slice';
import { getSocket } from '../../../api/socket';
import { InputFile } from '../inputFile';
import { useModal } from '../../../providers/ModalProvider/ModalProvider.hooks';
import { SendImageModal } from '../../authorizedPage';
import Microphone from '../../../../public/images/Microphone';
import { useVoiceRecording } from '../../../hooks/useVoiceRecording';


const SendComponent = () => {
  const dispatch = useAppDispatch();
  const {isEditMessage, messages, currentMessageId, messageUserId} = useAppSelector(state => state.auth);
  const {userInfo, currentRoomId, currentRoom, chatMessage, ownerId} = useAppSelector((state) => state.auth);
  const socket = getSocket();
  const {openModal} = useModal();
  const {isRecording, startRecording, stopRecording} = useVoiceRecording();

  const closeEditBlock = () => {
    dispatch(setChatMessage(''));
    dispatch(setIsEditMessage(false));
  };

  const submitMessage = (event: any) => {
    event.preventDefault();
    if (chatMessage) {
      if (!isEditMessage) {
        socket.emit('sendMessage', {
          userId: userInfo?.userId,
          roomName: currentRoom,
          roomId: Number(currentRoomId),
          content: chatMessage,
          username: userInfo?.username,
          type: 'text'
        });
      } else {
        socket.emit('editMessage', {
          messageUserId,
          ownerId,
          currentMessageId,
          userId: userInfo?.userId,
          roomName: currentRoom,
          content: chatMessage,
          username: userInfo?.username,
        });
      }
    }
    dispatch(setChatMessage(''));
    dispatch(setIsEditMessage(false));
  };


  return (
    <>
      <div className={!isEditMessage ? 'hidden' : sendStyles.edit}>
        <p className={styles.authorized__text}>{chatMessage}</p>
        <button className={'cursor-pointer'} onClick={closeEditBlock}><Close /></button>
      </div>
      <div className={'w-full h-[8px] bg-[#292634] border-t-[2px] border-b-[2px] border-[#221f2d]'} />
      <form onSubmit={submitMessage}
        onKeyDown={(event) => event.key === 'Enter' && submitMessage(event)}
        className={`${sendStyles.form} ${messages.length === 0 ? 'mt-auto' : 'mt-[25px]'}`}>
        <div className={'flex items-center w-full mb-[25px] px-[30px]'}>
          <Input
            isErrorHidden
            name='message'
            placeholder='Send message'
            type={'text'}
            value={chatMessage ? chatMessage : ''}
            onChangeFn={(event) => dispatch(setChatMessage(event.target.value))}
            class_name={sendStyles.input}
          />
          <div className={'flex items-center gap-[30px] justify-between'}>
            <button className={`${isRecording ? 'bg-[#3a5bbf] scale-116' :
              ''} transition-all cursor-pointer rounded-full flex-1 px-[6px] h-full`}
              onMouseDown={startRecording} onMouseUp={stopRecording} onMouseLeave={stopRecording}>
              <Microphone className={'drop-shadow-[0_0_3px_#2242b4]'} stroke={isRecording ? '#fff' : '#2242b4'} />
            </button>
            <InputFile
              onChangeFn={(event) => openModal(<SendImageModal selectedFile={event.target} />)} />
            <button
              disabled={!chatMessage}
              className={sendStyles.send}
              type='submit'>
              <Send className={'drop-shadow-[0_0_3px_#2242b4]'} />
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default SendComponent;
