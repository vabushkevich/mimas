import { transformAuth } from "./transformers";
import { Auth, RawAuth } from "./types";

const basicCredentials = btoa(`${process.env.REDDIT_APP_CLIENT_ID}:`);

export async function requestAuth(code?: string) {
  const params = code
    ? {
        grant_type: "authorization_code",
        code,
        redirect_uri: `${location.origin}/auth`,
      }
    : {
        grant_type: "https://oauth.reddit.com/grants/installed_client",
        device_id: "DO_NOT_TRACK_THIS_DEVICE",
      };

  const rawAuth = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    body: new URLSearchParams(params),
    headers: {
      Authorization: `Basic ${basicCredentials}`,
    },
  }).then((res) => res.json() as Promise<RawAuth>);

  return transformAuth(rawAuth);
}

export async function refreshAuth(refreshToken: string) {
  const rawAuth = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    headers: {
      Authorization: `Basic ${basicCredentials}`,
    },
  }).then((res) => res.json() as Promise<RawAuth>);
  return transformAuth(rawAuth);
}

export async function revokeAuth(refreshToken: string) {
  await fetch("https://www.reddit.com/api/v1/revoke_token", {
    method: "POST",
    body: new URLSearchParams({
      token: refreshToken,
      token_type_hint: "refresh_token",
    }),
    headers: {
      Authorization: `Basic ${basicCredentials}`,
    },
  });
}

export function readAuth() {
  return JSON.parse(localStorage.getItem("auth")) as Auth;
}

export function writeAuth(auth: Auth) {
  if (auth) {
    localStorage.setItem("auth", JSON.stringify(auth));
  } else {
    localStorage.removeItem("auth");
  }
}
