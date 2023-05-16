import React, { createContext, useState, useMemo, useContext } from "react";
import { readAuth } from "./utils";

type AuthContextType = {
  authorized: boolean;
  setAuthorized: (v: boolean) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (context == null) {
    throw new Error("AuthContext was used outside of its Provider");
  }

  return context;
}

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = readAuth();
  const [authorized, setAuthorized] = useState(!!auth?.refreshToken);

  const contextValue = useMemo(
    () => ({
      authorized,
      setAuthorized,
    }),
    [authorized, setAuthorized],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
