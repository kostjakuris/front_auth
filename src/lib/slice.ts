import { createSlice } from '@reduxjs/toolkit';
import { getUserInfo, login, logout, register, resetPassword, sendResetLink } from '../api/AuthProvider';

interface AppState {
  isAuth: boolean;
  isLoading: boolean;
  username: string | null;
  email: string | null;
  resetMessage: string | null;
  error: string | null;
}

const initialState: AppState = {
  isAuth: false,
  isLoading: false,
  username: null,
  email: null,
  resetMessage: null,
  error: null,
};

const appSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    getIsAuth: (state) => {
      const isUserAuthorized = localStorage.getItem('isAuth');
      if (isUserAuthorized === 'true') {
        state.isAuth = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUserInfo.pending, (state) => {
      state.isLoading = true;
    });
    
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.isLoading = false;
    });
    
    builder.addCase(getUserInfo.rejected, (state, action: any) => {
      state.error = action.payload.name as string;
      state.isLoading = false;
    });
    
    builder.addCase(sendResetLink.pending, (state) => {
      state.isLoading = true;
    });
    
    builder.addCase(sendResetLink.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.resetMessage = action.payload;
    });
    
    builder.addCase(sendResetLink.rejected, (state, action: any) => {
      state.isLoading = false;
      state.error = action.payload.message as string;
    });
    
    builder.addCase(resetPassword.pending, (state) => {
      state.isLoading = true;
    });
    
    builder.addCase(resetPassword.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.resetMessage = action.payload;
    });
    
    builder.addCase(resetPassword.rejected, (state, action: any) => {
      state.isLoading = false;
      state.error = action.payload.message as string;
    });
    
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });
    
    builder.addCase(login.fulfilled, (state) => {
      state.isAuth = true;
      localStorage.setItem('isAuth', String(state.isAuth));
      state.isLoading = false;
    });
    
    builder.addCase(login.rejected, (state, action: any) => {
      state.error = action.payload.message as string;
      state.isLoading = false;
    });
    
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
    });
    
    builder.addCase(logout.fulfilled, (state) => {
      state.isAuth = false;
      state.isLoading = false;
      localStorage.setItem('isAuth', 'false');
    });
    
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
    });
    
    builder.addCase(register.fulfilled, (state) => {
      state.isAuth = true;
      state.isLoading = false;
      localStorage.setItem('isAuth', String(state.isAuth));
    });
    
    builder.addCase(register.rejected, (state, action: any) => {
      state.error = action.payload.message as string;
      state.isLoading = false;
    });
    
  },
});

export const {getIsAuth} = appSlice.actions;
export default appSlice.reducer;