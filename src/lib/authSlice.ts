import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type User = {
  userId: number;
  username: string;
  email: string;
};

interface AuthState {
  isAuth: boolean;
  isAuthLoading: boolean;
  userInfo: User | null;
}

const initialState: AuthState = {
  isAuth: false,
  isAuthLoading: true,
  userInfo: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
    setIsAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isAuthLoading = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<User | null>) => {
      state.userInfo = action.payload;
    },
  },
});

export const { setIsAuth, setIsAuthLoading, setUserInfo } = authSlice.actions;
export default authSlice.reducer;
