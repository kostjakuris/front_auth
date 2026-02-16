import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from 'yup';


export interface AppState {
  isAuth: boolean;
  isEditMessage: boolean;
  isCreateRoom: boolean;
  messages: any[] | [];
  messageUserId: string | null;
  currentMessageId: string | null;
  isEditRoom: boolean;
  isChat: boolean;
  isRooms: boolean;
  isUsersList: boolean;
  userName: string | null;
  roomName: string | null;
  currentRoom: string | null;
  currentRoomId: string | null;
  userId: number | null;
  ownerId: number | null;
  chatMessage: string | null;
}

const initialState: AppState = {
  isAuth: false,
  messages: [],
  isEditMessage: false,
  isCreateRoom: false,
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
  userId: null,
  ownerId: null,
  userName: null,
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
    setNewMessage: (state, action) => {
      state.messages.push(action.payload as never);
    },
    updateMessage: (state, action) => {
      const i = state.messages.findIndex(m => m._id === action.payload._id);
      console.log({i});
      if (i !== -1) {
        state.messages[i] = { ...state.messages[i], ...action.payload };
      }
    },
    deleteMessageById: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(m => m._id !== action.payload);
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
    setIsCreateRoom: (state, action) => {
      state.isCreateRoom = action.payload;
    },
    setIsEditRoom: (state, action) => {
      state.isEditRoom = action.payload;
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
      state.userName = action.payload.userName;
      state.userId = action.payload.userId;
    },
    setRoomName: (state, action) => {
      state.roomName = action.payload;
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
  setCurrentRoom,
  setChatMessage,
  setOwnerId,
  setIsCreateRoom,
  setIsEditRoom,
  setIsChat,
  setIsRooms,
  setIsUsersList,
  setRoomName,
  setMessages,
  setMessageUserId,
  setCurrentMessageId
  
} = appSlice.actions;
export default appSlice.reducer;