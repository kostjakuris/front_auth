import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isChat: boolean;
  isRooms: boolean;
  isUsersList: boolean;
}

const initialState: UiState = {
  isChat: false,
  isRooms: false,
  isUsersList: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsChat: (state, action: PayloadAction<boolean>) => {
      state.isChat = action.payload;
    },
    setIsRooms: (state, action: PayloadAction<boolean>) => {
      state.isRooms = action.payload;
    },
    setIsUsersList: (state, action: PayloadAction<boolean>) => {
      state.isUsersList = action.payload;
    },
  },
});

export const { setIsChat, setIsRooms, setIsUsersList } = uiSlice.actions;
export default uiSlice.reducer;
