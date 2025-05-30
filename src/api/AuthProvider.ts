import { LoginFormFields, RegisterFormFields, ResetPasswordParams } from '../interfaces/form.interface';
import axios from 'axios';
import { deleteCookie, getToken } from './cookiesOperation';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const setAuthHeader = async() => {
  const accessToken = await getToken();
  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};

export const getUserInfo = createAsyncThunk('getUserInfo', async(_, thunkAPI) => {
  try {
    await setAuthHeader();
    const response = await axios.get(`${backendUrl}/user`, {withCredentials: true});
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const sendResetLink = createAsyncThunk('setResetLink', async(email: string, thunkAPI) => {
  try {
    const response = await axios.post(`${backendUrl}/forgot-password`, {email}, {withCredentials: true});
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const resetPassword = createAsyncThunk('resetPassword',
  async({token, password}: ResetPasswordParams, thunkAPI) => {
    try {
      const response = await axios.patch(`${backendUrl}/reset-password`, {
        password, token
      }, {withCredentials: true});
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const regenerateToken = async(refreshToken: string) => {
  try {
    const response = await axios.post(`${backendUrl}/regenerate-token`, {
      refreshToken,
    }, {withCredentials: true});
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const login = createAsyncThunk('login', async({
    email,
    password,
  }: LoginFormFields, thunkAPI,
) => {
  try {
    const response = await axios.post(`${backendUrl}/login`, {
      email,
      password,
    }, {withCredentials: true});
    await setAuthHeader();
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
  
});

export const logout = createAsyncThunk('logout', async(router: AppRouterInstance) => {
  await deleteCookie();
  router.push('/auth');
});

export const register = createAsyncThunk('register', async({
  username,
  email,
  password
}: RegisterFormFields, thunkAPI) => {
  try {
    const response = await axios.post(`${backendUrl}/register`, {
      username,
      email,
      password,
    }, {withCredentials: true});
    await setAuthHeader();
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

