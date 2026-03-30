import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LastMessage, Room } from '../interfaces/form.interface';

export type User = {
  userId: number;
  username: string;
  email: string;
};

export interface AppState {
  isAuth: boolean;
  isAuthLoading: boolean;
  isEditMessage: boolean;
  messages: any[] | [];
  rooms: Room[] | [];
  messageUserId: string | null;
  currentMessageId: string | null;
  isEditRoom: boolean;
  isChat: boolean;
  isRooms: boolean;
  isUsersList: boolean;
  roomName: string | null;
  currentRoom: string | null;
  chosenRoom: string | null;
  currentRoomId: string | null;
  chosenRoomId: string | null;
  userInfo: User | null;
  ownerId: number | null;
  chosenOwnerId: number | null;
  chatMessage: string | null;
}

const initialState: AppState = {
  isAuth: false,
  isAuthLoading: true,
  chosenRoom: null,
  chosenRoomId: null,
  chosenOwnerId: null,
  messages: [],
  rooms: [],
  userInfo: null,
  isEditMessage: false,
  roomName: null,
  messageUserId: null,
  currentMessageId: null,
  isEditRoom: false,
  isChat: false,
  isRooms: false,
  isUsersList: false,
  currentRoom: null,
  chatMessage: null,
  currentRoomId: null,
  ownerId: null,
};

const appSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    getIsAuth: (state) => {
      const isUserAuthorized = localStorage.getItem('isAuth');
      state.isAuth = isUserAuthorized === 'true';
    },
    setChatMessage: (state, action) => {
      state.chatMessage = action.payload;
    },
    setMessageUserId: (state, action) => {
      state.messageUserId = action.payload;
    },
    setCurrentMessageId: (state, action) => {
      state.currentMessageId = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
    setNewMessage: (state, action) => {
      state.messages.push(action.payload as never);
    },
    updateMessage: (state, action) => {
      const i = state.messages.findIndex(m => m._id === action.payload._id);
      if (i !== -1) {
        state.messages[i] = {...state.messages[i], ...action.payload};
      }
    },
    deleteMessageById: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(m => m._id !== action.payload);
    },
    updateRoomLastMessage: (state, action: PayloadAction<{ roomId: number; lastMessage: LastMessage | null }>) => {
      const room = state.rooms.find(r => r.id === action.payload.roomId);
      if (room) {
        room.lastMessage = action.payload.lastMessage;
      }
    },
    setIsEditMessage: (state, action) => {
      state.isEditMessage = action.payload;
    },
    setIsChat: (state, action) => {
      state.isChat = action.payload;
    },
    setIsRooms: (state, action) => {
      state.isRooms = action.payload;
    },
    setIsUsersList: (state, action) => {
      state.isUsersList = action.payload;
    },
    setIsEditRoom: (state, action) => {
      state.isEditRoom = action.payload;
    },
    setChosenOwnerId: (state, action) => {
      state.chosenOwnerId = action.payload;
    },
    setChosenRoom: (state, action) => {
      state.chosenRoom = action.payload;
    },
    setChosenRoomId: (state, action) => {
      state.chosenRoomId = action.payload;
    },
    setOwnerId: (state, action) => {
      state.ownerId = action.payload;
    },
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
    setCurrentRoomId: (state, action) => {
      state.currentRoomId = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setRoomName: (state, action) => {
      state.roomName = action.payload;
    },
    setIsAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isAuthLoading = action.payload;
    },
  },
  
});

export const {
  getIsAuth,
  setUserInfo,
  setIsEditMessage,
  setCurrentRoomId,
  setNewMessage,
  updateMessage,
  deleteMessageById,
  updateRoomLastMessage,
  setChosenRoomId,
  setChosenRoom,
  setChosenOwnerId,
  setCurrentRoom,
  setChatMessage,
  setOwnerId,
  setIsEditRoom,
  setIsChat,
  setIsRooms,
  setIsUsersList,
  setRoomName,
  setMessages,
  setRooms,
  setMessageUserId,
  setCurrentMessageId,
  setIsAuthLoading,

} = appSlice.actions;
export default appSlice.reducer;