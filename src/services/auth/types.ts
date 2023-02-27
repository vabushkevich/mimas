export type RawAuth = {
  access_token: string;
  device_id: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
};

export type Auth = {
  accessToken: string;
  expires: number;
  refreshToken?: string;
};
