import React from 'react';
import { LastMessage } from '../../../../../interfaces/form.interface';

interface LastMessagePreviewProps {
  lastMessage: LastMessage;
}

const LastMessagePreview = ({lastMessage}: LastMessagePreviewProps) => {
  switch (lastMessage.type) {
    case 'text':
      return <p>{lastMessage.message.length > 20 ? lastMessage.message.substring(0, 30) + '...' :
        lastMessage.message}</p>;
    case 'image':
      return (
        <div className={'flex items-center gap-[6px]'}>
          <img
            src={lastMessage.message}
            alt={lastMessage.fileName}
            className={'w-[13px] h-[13px] rounded-[3px] object-cover'}
          />
          <p>Image</p>
        </div>
      );
    case 'video':
      return (
        <div className={'flex items-center gap-[6px]'}>
          <video autoPlay={false} muted className={'w-[13px] h-[13px] rounded-[3px]'}>
            <source src={lastMessage.message} />
          </video>
          <p>Video</p>
        </div>
      );
    case 'voice':
      return <p>Voice message</p>;
    case 'file': {
      const name = lastMessage.fileName ?? '';
      const ext = name.includes('.') ? '.' + name.split('.').pop() : '';
      const base = name.includes('.') ? name.slice(0, name.lastIndexOf('.')) : name;
      const display = base.length > 15 ? base.substring(0, 15) + '...' + ext : name;
      return <p>{display}</p>;
    }
    default:
      return null;
  }
};

export default LastMessagePreview;
