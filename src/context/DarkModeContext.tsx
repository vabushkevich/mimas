import { useLocalStorage, useMediaQuery, useTransitionState } from "@hooks";
import React, { createContext, useContext, useLayoutEffect } from "react";

import "./DarkModeContext.scss";

type DarkModeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextType | null>(null);

function applyColorMode(dark: boolean) {
  const colorMode = dark ? "dark" : "light";
  document.documentElement.setAttribute("data-color-mode", colorMode);
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);

  if (context == null) {
    throw new Error("useDarkMode was used outside of its Provider");
  }

  return context;
}

export function DarkModeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [storedIsDarkMode, setIsDarkMode] = useLocalStorage(
    "dark-mode",
    prefersDarkMode,
  );
  const isDarkMode = !!storedIsDarkMode;
  const [isSystemColorMode, setIsSystemColorMode] = useLocalStorage(
    "use-system-color-mode",
    true,
  );
  const transition = useTransitionState({ duration: 200, in: isDarkMode });

  const toggleDarkMode = () => {
    const nextIsDarkMode = !isDarkMode;
    setIsDarkMode(nextIsDarkMode);
    setIsSystemColorMode(nextIsDarkMode == prefersDarkMode);
    document.documentElement.setAttribute("data-color-mode-changing", "");
    applyColorMode(nextIsDarkMode);
  };

  useLayoutEffect(() => applyColorMode(isDarkMode), []);

  useLayoutEffect(() => {
    if (isSystemColorMode && isDarkMode != prefersDarkMode) toggleDarkMode();
  }, [prefersDarkMode]);

  useLayoutEffect(() => {
    if (!transition.isActive) {
      document.documentElement.removeAttribute("data-color-mode-changing");
    }
  }, [transition.isActive]);

  const contextValue = { isDarkMode, toggleDarkMode };

  return (
    <DarkModeContext.Provider value={contextValue}>
      {children}
    </DarkModeContext.Provider>
  );
}
