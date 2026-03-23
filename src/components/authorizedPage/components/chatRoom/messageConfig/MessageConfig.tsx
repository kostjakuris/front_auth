import styles from '../../../authorized.module.scss';
import msgStyles from './messageConfig.module.scss';
import React, { JSX } from 'react';

export type MessageType = 'text' | 'image' | 'video';

export interface MessageProps {
  id: string;
  createdAt: string;
  fullPath: string | null;
  isUpdated: boolean;
  message: string;
  roomId: number;
  updatedAt: string;
  messageUserId: string;
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
      <span className={userId === Number(messageUserId) ? msgStyles.right_triangle :
        msgStyles.left_triangle} />
      <p className={`${styles.authorized__text} whitespace-pre-line break-all`}>{message}</p>
      {
        updatedAt && isUpdated ?
          <p className={'mt-2 text-gray-300 px-[20px]'}>updated at: {updatedAt}</p>
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
      <img onLoad={scrollFn} className={'w-fit h-fit rounded-b-[20px]'} src={message}
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
      <p className={`${msgStyles.nickname} ${userId === Number(messageUserId) ? 'text-yellow-300' :
        'text-green-400'}`}>
        {username}
      </p>
      <video onLoadedData={scrollFn} controls className={'w-fit h-fit rounded-b-[20px]'}>
        <source src={message} />
      </video>
    </div>
  ),
};