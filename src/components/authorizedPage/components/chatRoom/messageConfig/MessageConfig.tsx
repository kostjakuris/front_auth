import styles from '../../../authorized.module.scss';
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
  scrollFn: () => void;
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
      onContextMenu={(event) => contextMenuFn(event, message, id, String(userId), type, String(fullPath))}
      className={userId === Number(messageUserId) ? styles.authorized__chat_myMessage :
        styles.authorized__chat_message}
    >
      <p className={`${styles.authorized__chats_nickname}
                              ${userId === Number(messageUserId) ? 'text-yellow-300' : 'text-green-400'}`}>
        {username}
      </p>
      <p className={`${styles.authorized__text} whitespace-pre-line break-all`}>{message}</p>
      
      {
        updatedAt && isUpdated ?
          <p className={'mt-2 text-gray-300'}>updated at: {updatedAt}</p>
          : null
      }
    </div>
  ),
  image: ({id, message, userId, fullPath, scrollFn, contextMenuFn, type}: MessageProps) => (
    <div
      onContextMenu={(event) => contextMenuFn(event, message,
        id,
        String(userId), type, String(fullPath)
      )}
    >
      <img onLoad={scrollFn} className={'w-fit h-fit'} src={message}
        alt={message} />
    </div>
  ),
  video: ({id, message, userId, fullPath, contextMenuFn, type}: MessageProps) => (
    <div
      className={'w-fit'}
      onContextMenu={(event) => contextMenuFn(event, message,
        id,
        String(userId), type, String(fullPath)
      )}
    >
      <video controls className={'w-fit h-fit'}>
        <source src={message} />
      </video>
    </div>
  ),
};