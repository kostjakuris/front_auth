import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LastMessage, Room } from '../interfaces/form.interface';

interface RoomsState {
  rooms: Room[];
  currentRoom: Room | null;
  chosenRoom: Room | null;
  roomName: string | null;
  isEditRoom: boolean;
  ownerId: number | null;
}

const initialState: RoomsState = {
  rooms: [],
  currentRoom: null,
  chosenRoom: null,
  roomName: null,
  isEditRoom: false,
  ownerId: null,
};

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
    },
    setCurrentRoom: (state, action: PayloadAction<Room | null>) => {
      state.currentRoom = action.payload;
    },
    setChosenRoom: (state, action: PayloadAction<Room | null>) => {
      state.chosenRoom = action.payload;
    },
    setRoomName: (state, action: PayloadAction<string | null>) => {
      state.roomName = action.payload;
    },
    setIsEditRoom: (state, action: PayloadAction<boolean>) => {
      state.isEditRoom = action.payload;
    },
    setOwnerId: (state, action: PayloadAction<number | null>) => {
      state.ownerId = action.payload;
    },
    updateRoomLastMessage: (state, action: PayloadAction<{ roomId: number; lastMessage: LastMessage | null }>) => {
      const room = state.rooms.find(r => r.id === action.payload.roomId);
      if (room) {
        room.lastMessage = action.payload.lastMessage;
      }
    },
  },
});

export const {
  setRooms,
  setCurrentRoom,
  setChosenRoom,
  setRoomName,
  setIsEditRoom,
  setOwnerId,
  updateRoomLastMessage,
} = roomsSlice.actions;
export default roomsSlice.reducer;
