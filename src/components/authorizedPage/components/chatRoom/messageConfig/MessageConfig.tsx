import styles from '../../../authorized.module.scss';
import msgStyles from './messageConfig.module.scss';
import React, { JSX } from 'react';
import File from '../../../../../../public/images/File';

export type MessageType = 'text' | 'image' | 'video' | 'voice' | 'file';

export interface MessageProps {
  id: string;
  createdAt: string;
  fullPath: string | null;
  isUpdated: boolean;
  message: string;
  roomId: number;
  updatedAt: string;
  messageUserId: string;
  fileName: string;
  fileSize: string;
  type: MessageType;
  userId: number;
  username: string;
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
    contextMenuFn,
    type
  }: MessageProps) => (
    <div
      onContextMenu={(event) => contextMenuFn(event, message, id, String(messageUserId), type, String(fullPath))}
      className={userId === Number(messageUserId) ? msgStyles.my_message :
        msgStyles.message}
    >
      <p className={`${msgStyles.nickname} ${userId === Number(messageUserId) ? 'text-yellow-300' :
        'text-green-400'}`}>
        {username}
      </p>
      <p className={`${styles.authorized__text} whitespace-pre-line break-all`}>{message}</p>
      {
        updatedAt && isUpdated ?
          <p className={'mt-2 text-gray-300! font-normal text-[12px] px-[15px]'}>updated at: {updatedAt}</p>
          : null
      }
    </div>
  ),
  image: ({id, message, userId, fullPath, scrollFn, contextMenuFn, messageUserId, type, username}: MessageProps) => (
    <div
      className={`${userId === Number(messageUserId) ? msgStyles.my_message :
        msgStyles.message} px-0! pb-0! rounded-b-[25px]!`}
      onContextMenu={(event) => contextMenuFn(event, message,
        id, String(messageUserId), type, String(fullPath)
      )}
    >
      <p className={`${msgStyles.nickname} ${userId === Number(messageUserId) ? 'text-yellow-300' :
        'text-green-400'}`}>
        {username}
      </p>
      <img onLoad={scrollFn} className={'w-fit h-fit mt-[9px] rounded-b-[20px]'} src={message}
        alt={message} />
    </div>
  ),
  video: ({id, message, userId, scrollFn, fullPath, contextMenuFn, messageUserId, username, type}: MessageProps) => (
    <div
      className={`${userId === Number(messageUserId) ? msgStyles.my_message :
        msgStyles.message} px-0! pb-0! rounded-b-[25px]!`}
      onContextMenu={(event) => contextMenuFn(event, message,
        id, String(messageUserId), type, String(fullPath)
      )}
    >
      <p className={`${msgStyles.nickname} ${userId === Number(messageUserId) ? 'text-[#facc15]' :
        'text-[#34d397]'}`}>
        {username}
      </p>
      <video onLoadedData={scrollFn} controls className={'w-fit h-fit mt-[9px] rounded-b-[20px]'}>
        <source src={message} />
      </video>
    </div>
  ),
  voice: ({id, message, userId, scrollFn, fullPath, contextMenuFn, messageUserId, username, type}: MessageProps) => (
    <div
      className={`${userId === Number(messageUserId) ? msgStyles.my_message :
        msgStyles.message} px-0! pb-0! rounded-b-[25px]! min-w-[300px]`}
      onContextMenu={(event) => contextMenuFn(event, message,
        id, String(messageUserId), type, String(fullPath)
      )}
    >
      <p className={`${msgStyles.nickname} ${userId === Number(messageUserId) ? 'text-[#facc15]' :
        'text-[#34d397]'}`}>
        {username}
      </p>
      <audio onLoadedData={scrollFn} controls className={'w-full mt-[9px] rounded-b-[20px]'}>
        <source src={message} />
      </audio>
    </div>
  ),
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
    fileSize,
  }: MessageProps) => (
    <div
      onContextMenu={(event) => contextMenuFn(event, message, id, String(messageUserId), type, String(fullPath))}
      className={userId === Number(messageUserId) ? msgStyles.my_message :
        msgStyles.message}
    >
      <p className={`${msgStyles.nickname} ${userId === Number(messageUserId) ? 'text-yellow-300' :
        'text-green-400'}`}>
        {username}
      </p>
      <a href={message} download={message} className={'flex items-stretch gap-[15px] mt-[9px] px-[15px]'}>
        <span className={'bg-[#0C36B6FF] h-full rounded-full p-[10px] flex-1'}><File /></span>
        <div className={'flex-1 h-full'}>
          <p className={`${styles.authorized__text} font-medium! px-0! pt-[5px]! mt-0! whitespace-pre-line`}>{fileName}</p>
          <p className={'mt-[5px] leading-[100%] text-white/70 text-[16px]'}>{fileSize}</p>
        </div>
      </a>
    </div>
  ),
};