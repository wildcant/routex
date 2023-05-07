import { JWT_EXPIRATION, JWT_SECRET } from '$env/static/private';
import type { RequestEvent } from '@sveltejs/kit';
import { SignJWT, decodeJwt } from 'jose';
import { sanitizedUser, type SanitizedUser } from '../../types';

export const JWT_COOKIE_KEY = 'token';
export const authenticateUser = (event: RequestEvent): SanitizedUser | null => {
  const { cookies } = event;
  const userToken = cookies.get(JWT_COOKIE_KEY);

  if (!userToken) return null;

  let result;
  try {
    result = sanitizedUser.safeParse(
      JSON.parse(Buffer.from(userToken.split('.')[1], 'base64').toString())
    );
  } catch (error) {
    result = { success: false, data: null };
  }

  if (!result.success) return null;

  const user = result.data;
  return user;
};

type GenerateUserTokenResponse = Promise<{
  token: string;
  expires: number;
}>;
export const generateUserToken = async (user: SanitizedUser): GenerateUserTokenResponse => {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_EXPIRATION)
    .sign(secret);
  const expires = decodeJwt(token).exp as number;
  return { token, expires };
};
