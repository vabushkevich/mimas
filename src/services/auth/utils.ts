import { transformAuth } from "./transformers";
import { Auth, RawAuth } from "./types";

const basicCredentials = btoa(`${process.env.REDDIT_APP_CLIENT_ID}:`);

export async function requestAuth(code?: string) {
  const params: Record<string, string> = code
    ? {
        code,
        grant_type: "authorization_code",
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

export function getAuthURL() {
  const params = new URLSearchParams({
    client_id: process.env.REDDIT_APP_CLIENT_ID,
    response_type: "code",
    state: `${Date.now()}${location.pathname}${location.search}`,
    redirect_uri: `${location.origin}/auth`,
    duration: "permanent",
    scope:
      "edit history identity mysubreddits privatemessages read save submit subscribe vote",
  });

  return `https://www.reddit.com/api/v1/authorize.compact?${params}`;
}

export function readAuth() {
  const value = localStorage.getItem("auth");
  if (value == null) return;
  return JSON.parse(value) as Auth;
}

export function storeAuth(auth: Auth) {
  localStorage.setItem("auth", JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem("auth");
}
