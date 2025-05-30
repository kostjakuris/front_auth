'use server';
import { cookies } from 'next/headers';

export async function getToken() {
  return (await cookies()).get('access_token')?.value;
}

export async function getRefreshToken() {
  return (await cookies()).get('refresh_token')?.value;
}

export async function deleteCookie() {
  (await cookies()).delete('access_token');
  (await cookies()).delete('refresh_token');
}