import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MessagesState {
  messages: any[];
  isEditMessage: boolean;
  isReplaceMessage: boolean;
  currentMessageId: string | null;
  messageUserId: string | null;
  chatMessage: string | null;
}

const initialState: MessagesState = {
  messages: [],
  isEditMessage: false,
  isReplaceMessage: false,
  currentMessageId: null,
  messageUserId: null,
  chatMessage: null,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setNewMessage: (state, action) => {
      state.messages.push(action.payload as never);
    },
    updateMessage: (state, action) => {
      const i = state.messages.findIndex(m => m._id === action.payload._id);
      if (i !== -1) {
        state.messages[i] = { ...state.messages[i], ...action.payload };
      }
    },
    deleteMessageById: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(m => m._id !== action.payload);
    },
    setIsEditMessage: (state, action: PayloadAction<boolean>) => {
      state.isEditMessage = action.payload;
    },
    setIsReplaceMessage: (state, action: PayloadAction<boolean>) => {
      state.isReplaceMessage = action.payload;
    },
    setCurrentMessageId: (state, action: PayloadAction<string | null>) => {
      state.currentMessageId = action.payload;
    },
    setMessageUserId: (state, action: PayloadAction<string | null>) => {
      state.messageUserId = action.payload;
    },
    setChatMessage: (state, action: PayloadAction<string | null>) => {
      state.chatMessage = action.payload;
    },
  },
});

export const {
  setMessages,
  setNewMessage,
  updateMessage,
  deleteMessageById,
  setIsEditMessage,
  setIsReplaceMessage,
  setCurrentMessageId,
  setMessageUserId,
  setChatMessage,
} = messagesSlice.actions;
export default messagesSlice.reducer;
