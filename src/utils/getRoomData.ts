'use client';
import { useCreateNewDirectRoomMutation } from '../lib/roomApi';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { setCurrentRoom } from '../lib/roomsSlice';
import { getSocket } from '../api/socket';

export const getRoomData = () => {
  const [createDirectRoom] = useCreateNewDirectRoomMutation();
  const {currentRoom} = useAppSelector(state => state.rooms);
  const {userInfo} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  
  const resolveRoomData = async() => {
    if (currentRoom?.username) {
      const socket = getSocket();
      const directRoom = await createDirectRoom({targetUserId: currentRoom?.id}).unwrap();
      dispatch(setCurrentRoom(directRoom));
      socket.emit('joinRoom', {roomName: directRoom.name});
      socket.emit('getDirectRoom',
        {userId: String(directRoom.users.find((user: any) => user.id !== userInfo?.userId)?.id), roomId: directRoom.id},
      );
      return {roomName: directRoom.name, roomId: directRoom.id};
    }
    return {roomName: currentRoom?.name, roomId: Number(currentRoom?.id)};
  };
  
  return {resolveRoomData};
};
