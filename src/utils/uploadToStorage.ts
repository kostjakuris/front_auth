import { getDownloadURL, ref, uploadBytes, UploadMetadata } from '@firebase/storage';
import { storage } from '../firebase';
import { v4 } from 'uuid';
import type { MessageType } from '../components/authorizedPage/components/chatRoom/messageConfig/MessageConfig';

export const resolveMessageType = (mimeType: string): Exclude<MessageType, 'text' | 'voice'> => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return 'file';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)}KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)}MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)}GB`;
};

export const uploadToStorage = async(
  roomName: string,
  folder: 'images' | 'videos' | 'files' | 'voices',
  fileName: string,
  file: Blob,
  metadata?: UploadMetadata,
) => {
  const fileRef = ref(storage, `${roomName}/${folder}/${fileName + v4()}`);
  await uploadBytes(fileRef, file, metadata);
  const url = await getDownloadURL(fileRef);
  return {url, fullPath: fileRef.fullPath};
};
