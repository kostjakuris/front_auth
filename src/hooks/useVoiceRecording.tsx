import { useRef, useState } from 'react';
import { useAppSelector } from '../lib/hooks';
import { getSocket } from '../api/socket';
import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage';
import { storage } from '../firebase';
import { v4 } from 'uuid';

export const useVoiceRecording = () => {
  const {userInfo, currentRoomId, currentRoom} = useAppSelector((state) => state.auth);
  const socket = getSocket();

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
    if (voiceFile) {
      const fileRef = ref(storage, `${currentRoom}/voices/${fileName}`);
      if (!fileRef) return;
      uploadBytesResumable(fileRef, voiceFile, {
        contentType: fileType,
      }).then((response) => {
        getDownloadURL(fileRef).then((url) => {
          socket.emit('sendMessage', {
            userId: userInfo?.userId,
            roomName: currentRoom,
            roomId: Number(currentRoomId),
            content: url,
            fullPath: response.metadata.fullPath,
            username: userInfo?.username,
            type: 'voice'
          });
        });
      });
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
