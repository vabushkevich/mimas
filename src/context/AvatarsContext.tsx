import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";

type AvatarsContextType = {
  avatars: Record<string, string>;
  addAvatars: (avatars: Record<string, string>) => void;
};

export const AvatarsContext = createContext<AvatarsContextType>(null);

export function AvatarsContextProvider(
  { children }: { children: React.ReactNode }
) {
  const [avatars, setAvatars] = useState<Record<string, string>>({});

  const addAvatars = useCallback((avatars: Record<string, string>) => {
    setAvatars((oldAvatars) => ({ ...oldAvatars, ...avatars }));
  }, []);

  const contextValue = useMemo(() => ({
    avatars,
    addAvatars,
  }), [avatars, addAvatars]);

  return (
    <AvatarsContext.Provider value={contextValue}>
      {children}
    </AvatarsContext.Provider>
  );
}

export function useAvatarsContext() {
  return useContext(AvatarsContext);
}
