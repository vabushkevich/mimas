import { Auth, RawAuth } from "./types";

export function transformAuth(rawAuth: RawAuth): Auth {
  const { access_token, expires_in, refresh_token } = rawAuth;

  const auth: Auth = {
    accessToken: access_token,
    expires: Date.now() + expires_in * 1000,
  };

  if (refresh_token) auth.refreshToken = refresh_token;

  return auth;
}
