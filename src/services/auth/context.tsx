import React, { createContext, useState, useMemo } from "react";
import { readAuth } from "./utils";

type AuthContextType = {
  authorized: boolean;
  setAuthorized: (v: boolean) => void;
};

export const AuthContext = createContext<AuthContextType>(null);

export function AuthContextProvider(
  { children }: { children: React.ReactNode }
) {
  const auth = readAuth();
  const [authorized, setAuthorized] = useState(!!auth?.refreshToken);

  const contextValue = useMemo(() => ({
    authorized,
    setAuthorized,
  }), [authorized, setAuthorized]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
