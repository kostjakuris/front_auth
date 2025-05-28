import { FormFields } from '../folder/form.interface';
import axios from 'axios';


const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
export const login = async({email, password}: FormFields) => {
  const response = await axios.post(`${backendUrl}/login`, {
    email,
    password,
  });
  return response.data;
};

export const register = async({email, password}: FormFields) => {
  const response = await axios.post(`${backendUrl}/register`, {
    email,
    password,
  });
  return response.data;
};