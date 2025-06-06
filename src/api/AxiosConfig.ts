import { getToken } from './cookiesOperation';
import axios from 'axios';

export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const setAuthHeader = async() => {
  const accessToken = await getToken();
  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};