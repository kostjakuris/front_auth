import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { getSocket } from '../api/socket';
import { v4 } from 'uuid';
import { getRoomData } from '../utils/getRoomData';
import { uploadToStorage } from '../utils/uploadToStorage';
import { setIsReplaceMessage } from '../lib/messagesSlice';

export const useVoiceRecording = () => {
  const {userInfo} = useAppSelector(state => state.auth);
  const {currentRoom} = useAppSelector(state => state.rooms);
  const {isReplaceMessage, currentMessageId, messageUserId} = useAppSelector(state => state.messages);
  const socket = getSocket();
  const dispatch = useAppDispatch();
  const {resolveRoomData} = getRoomData();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startedAtRef = useRef<number | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  
  const pickMimeType = () => {
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus',
    ];
    
    for (const type of candidates) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    
    return '';
  };
  
  const submitFile = async(voiceFile: Blob, fileName: string, fileType: string) => {
    const {roomName, roomId} = await resolveRoomData();
    if (voiceFile) {
      const {url, fullPath} = await uploadToStorage(roomName ?? '', 'voices', fileName, voiceFile, {
        contentType: fileType,
      });
      if (isReplaceMessage) {
        socket.emit('editMessage', {
          messageUserId,
          ownerId: currentRoom?.ownerId,
          currentMessageId,
          userId: userInfo?.userId,
          roomName,
          roomId,
          content: url,
          fullPath,
          username: userInfo?.username,
          type: 'voice'
        });
        dispatch(setIsReplaceMessage(false));
      } else {
        socket.emit('sendMessage', {
          userId: userInfo?.userId,
          roomName,
          roomId,
          content: url,
          fullPath,
          username: userInfo?.username,
          type: 'voice'
        });
      }
    }
  };
  
  const startRecording = async() => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      streamRef.current = stream;
      
      const mimeType = pickMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, {mimeType})
        : new MediaRecorder(stream);
      
      chunksRef.current = [];
      startedAtRef.current = Date.now();
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone access error:', error);
      alert('Microphone access denied. Please allow access to your microphone and try again.');
    }
  };
  
  const stopRecording = async() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    
    recorder.onstop = async() => {
      const mimeType = recorder.mimeType || 'audio/webm';
      const blob = new Blob(chunksRef.current, {type: mimeType});
      
      const ext = mimeType.includes('mp4')
        ? 'mp4'
        : mimeType.includes('ogg')
          ? 'ogg'
          : 'webm';
      
      const fileName = `${Date.now()}-${v4()}.${ext}`;
      
      try {
        await submitFile(blob, fileName, mimeType);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      mediaRecorderRef.current = null;
      chunksRef.current = [];
      startedAtRef.current = null;
      setIsRecording(false);
    };
    recorder.stop();
  };
  
  return {isRecording, startRecording, stopRecording};
};
