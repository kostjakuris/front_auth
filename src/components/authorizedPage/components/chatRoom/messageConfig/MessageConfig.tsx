import styles from '../../../authorized.module.scss';
import msgStyles from './messageConfig.module.scss';
import React, { JSX } from 'react';
import File from '../../../../../../public/images/File';
import dayjs from 'dayjs';

export type MessageType = 'text' | 'image' | 'video' | 'voice' | 'file';

export interface MessageProps {
  id: string;
  createdAt: string;
  messages: any[];
  fullPath: string | null;
  isUpdated: boolean;
  message: string;
  roomId?: number;
  updatedAt: string;
  messageUserId: string;
  fileName: string;
  fileSize: string;
  type: MessageType;
  userId: number;
  username: string;
  isTheSameUser?: boolean;
  scrollFn?: () => void;
  contextMenuFn: (event: any, message: string, messageId: string, userId: string, type: string,
    fullPath: string) => void;
}

export const messageConfig: Record<MessageType, (props: MessageProps) => JSX.Element> = {
  text: ({
    id,
    message,
    username,
    updatedAt,
    userId,
    fullPath,
    isUpdated,
    messageUserId,
    isTheSameUser,
    createdAt,
    contextMenuFn,
    type
  }: MessageProps) => {
    const showNickname = !isTheSameUser && userId !== Number(messageUserId);
    return (
    <div
      onContextMenu={(event) => contextMenuFn(event, message, id, String(messageUserId), type, String(fullPath))}
      className={`${userId === Number(messageUserId) ? msgStyles.my_message : msgStyles.message} ${!showNickname ? 'pt-[13px]!' : ''}`}
    >
      {
        showNickname &&
        <p className={`${msgStyles.nickname} text-green-400`}>
          {username}
        </p>
      }
      <p className={`${styles.authorized__text} whitespace-pre-line break-all`}>{message}</p>
      {
        updatedAt && isUpdated ?
          <p className={'mt-2 text-gray-300! leading-[100%] font-normal text-[12px] px-[10px]'}>updated
            at: {updatedAt}</p>
          : <p className={'mt-2 ml-auto text-gray-300! leading-[100%] font-normal text-[12px] px-[10px]'}>{dayjs(
            createdAt).format('HH:MM')}</p>
      }
    </div>
    );
  },
  image: ({
    id,
    message,
    userId,
    fullPath,
    scrollFn,
    contextMenuFn,
    messageUserId,
    type,
    username,
    createdAt,
    isTheSameUser
  }: MessageProps) => {
    const showNickname = !isTheSameUser && userId !== Number(messageUserId);
    return (
    <div
      className={`p-0! bg-none! bg-transparent! ${userId === Number(messageUserId) ? msgStyles.my_message :
        msgStyles.message}`}
      onContextMenu={(event) => contextMenuFn(event, message,
        id, String(messageUserId), type, String(fullPath)
      )}
    >
      {
        showNickname &&
        <p className={`${msgStyles.nickname} text-green-400`}>
          {username}
        </p>
      }
      <div className={`relative ${!showNickname ? 'pt-[13px]!' : ''}`}>
        <img onLoad={scrollFn} className={'w-fit h-fit rounded-[10px]'} src={message}
          alt={message} />
        <p className={'absolute bottom-[13px] bg-[#343144] px-[8px] py-[3px] rounded-[10px] right-[10px]' +
          ' text-gray-300! leading-[100%] font-normal text-[12px]'}>{dayjs(createdAt).format('HH:MM')}</p>
      </div>
    </div>
    );
  },
  video: ({
    id,
    message,
    userId,
    scrollFn,
    fullPath,
    contextMenuFn,
    messageUserId,
    username,
    type,
    createdAt,
    isTheSameUser
  }: MessageProps) => {
    const showNickname = !isTheSameUser && userId !== Number(messageUserId);
    return (
    <div
      className={`p-0! bg-none! bg-transparent! ${userId === Number(messageUserId) ? msgStyles.my_message :
        msgStyles.message} `}
      onContextMenu={(event) => contextMenuFn(event, message,
        id, String(messageUserId), type, String(fullPath)
      )}
    >
      {
        showNickname &&
        <p className={`${msgStyles.nickname} text-green-400`}>
          {username}
        </p>
      }
      <div className={`relative ${!showNickname ? 'pt-[13px]!' : ''}`}>
        <video onLoadedData={scrollFn} controls className={'w-fit h-fit rounded-[10px]'}>
          <source src={message} />
        </video>
        <p className={'absolute bottom-[70px] bg-[#343144] px-[8px] py-[3px] rounded-[10px] right-[10px]' +
          ' text-gray-300! leading-[100%] font-normal text-[12px]'}>{dayjs(createdAt).format('HH:MM')}</p>
      </div>
    </div>
    );
  },
  voice: ({
    id,
    message,
    userId,
    scrollFn,
    fullPath,
    contextMenuFn,
    messageUserId,
    username,
    type,
    createdAt,
    isTheSameUser
  }: MessageProps) => {
    const showNickname = !isTheSameUser && userId !== Number(messageUserId);
    return (
    <div
      className={`px-[13px]! min-w-[340px] ${!showNickname ? 'pt-[13px]!' : ''} ${userId === Number(messageUserId) ?
        msgStyles.my_message : msgStyles.message} `}
      onContextMenu={(event) => contextMenuFn(event, message,
        id, String(messageUserId), type, String(fullPath)
      )}
    >
      {
        showNickname &&
        <p className={`${msgStyles.nickname} pl-0! text-green-400`}>
          {username}
        </p>
      }
        <audio onLoadedData={scrollFn} controls className={'w-full rounded-b-[20px]'}>
          <source src={message} />
        </audio>
        <p className={'mt-2 ml-auto text-gray-300! leading-[100%] font-normal text-[12px] pl-[10px]'}>{dayjs(
          createdAt).format('HH:MM')}</p>
    </div>
    );
  },
  file: ({
    id,
    message,
    username,
    userId,
    fullPath,
    messageUserId,
    contextMenuFn,
    type,
    fileName,
    createdAt,
    fileSize,
    isTheSameUser,
  }: MessageProps) => {
    const showNickname = !isTheSameUser && userId !== Number(messageUserId);
    return (
    <div
      onContextMenu={(event) => contextMenuFn(event, message, id, String(messageUserId), type, String(fullPath))}
      className={`${userId === Number(messageUserId) ? msgStyles.my_message : msgStyles.message} ${!showNickname ? 'pt-[13px]!' : ''}`}
    >
      {
        showNickname &&
        <p className={`${msgStyles.nickname} text-green-400`}>
          {username}
        </p>
      }
      <a href={message} download={message}
        className={'flex h-full items-stretch gap-[10px] px-[10px]'}>
        <span className={`${userId === Number(messageUserId) ? 'bg-[#0C36B6FF]' :
          'bg-[#222030FF]'} h-full rounded-full p-[10px] w-fit`}><File /></span>
        <div className={'flex-1 flex flex-col justify-between gap-[5px] h-full'}>
          <p
            className={`${styles.authorized__text} font-medium! px-0! pt-[5px]! mt-0! whitespace-pre-line`}>{fileName}</p>
          <div className={'flex items-center'}>
            <p className={'leading-[100%] text-white/70 text-[15px]'}>{fileSize}</p>
            <p className={'mt-[10px] ml-auto text-gray-300! leading-[100%] font-normal text-[12px] pl-[10px]'}>{dayjs(
              createdAt).format('HH:MM')}</p>
          </div>
        </div>
      </a>
    </div>
    );
  },
};