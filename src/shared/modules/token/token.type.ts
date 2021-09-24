import { Id } from '@src/shared/types';

export type AccessToken = string;
export type AccessTokenPayload = {
  userId: Id;
  role: string;
};
export type RefreshToken = string;
export type RefreshTokenPayload = {
  userId: Id;
};
