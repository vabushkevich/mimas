import { useCallback, useContext } from "react";
import { useQueryString } from "@hooks";
import {
  readAuth,
  refreshAuth,
  requestAuth,
  revokeAuth,
  writeAuth,
} from "./utils";
import { AuthContext } from "./context";
import credentials from "@credentials";

export async function getAccessToken(): Promise<string> {
  let auth = readAuth();

  if (!auth || Date.now() >= auth.expires) {
    auth = auth?.refreshToken
      ? await refreshAuth(auth.refreshToken)
      : await requestAuth();
    writeAuth(auth);
  }

  return auth.accessToken;
}

export function useAuth() {
  const { authorized, setAuthorized } = useContext(AuthContext);

  const authorize = useCallback(async (code: string) => {
    const auth = await requestAuth(code);
    writeAuth(auth);
    setAuthorized(true);
  }, []);

  const unauthorize = useCallback(() => {
    const auth = readAuth();
    revokeAuth(auth?.refreshToken);
    writeAuth(null);
    setAuthorized(false);
  }, []);

  return { authorized, authorize, unauthorize };
}

export function getAuthURL() {
  const params = new URLSearchParams({
    client_id: credentials.reddit.clientId,
    response_type: "code",
    state: `${Date.now()}${location.pathname}${location.search}`,
    redirect_uri: "http://localhost:8080/auth",
    duration: "permanent",
    scope: "edit history identity mysubreddits privatemessages read save submit subscribe vote",
  });

  return `https://www.reddit.com/api/v1/authorize.compact?${params}`;
}

export function useRedirectURLParams() {
  const { code, state } = useQueryString<{ code: string, state: string }>();
  const redirectTo = state.match(/\d+(.+)/)[1];

  return { code, redirectTo };
}

export { AuthContextProvider } from "./context";
