import { debounceAsync } from "@utils";
import { useQueryString } from "@hooks";
import {
  readAuth,
  refreshAuth,
  requestAuth,
  revokeAuth,
  storeAuth,
  clearAuth,
  getAuthURL,
} from "./utils";
import { useAuthContext } from "./context";

export const getAccessToken = debounceAsync(async () => {
  let auth = readAuth();

  if (!auth || Date.now() >= auth.expires) {
    auth = auth?.refreshToken
      ? await refreshAuth(auth.refreshToken)
      : await requestAuth();
    storeAuth(auth);
  }

  return auth.accessToken;
});

export function useAuth() {
  const { authorized, setAuthorized } = useAuthContext();

  const authorize = async (code: string) => {
    const auth = await requestAuth(code);
    storeAuth(auth);
    setAuthorized(true);
  };

  const signIn = () => {
    location.assign(getAuthURL());
  };

  const signOut = () => {
    const auth = readAuth();
    if (auth && auth.refreshToken) revokeAuth(auth.refreshToken);
    clearAuth();
    setAuthorized(false);
  };

  return { authorized, authorize, signIn, signOut };
}

export function useAuthPageParams() {
  const { code, state } = useQueryString<{ code: string; state: string }>();
  const redirectTo = state?.match(/\d+(.+)/)?.[1];

  return { code, redirectTo };
}

export { AuthContextProvider } from "./context";
