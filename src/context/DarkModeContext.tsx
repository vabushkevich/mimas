import { useLocalStorage, useMediaQuery } from "@hooks";
import React, { createContext, useContext, useLayoutEffect } from "react";

type DarkModeContextType = {
  darkModeEnabled: boolean;
  toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextType | null>(null);

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
  const preferredMode = useMediaQuery("(prefers-color-scheme: dark)")
    ? "dark"
    : "light";
  const [mode, setMode] = useLocalStorage<"dark" | "light" | "system">(
    "color-mode",
    "system",
  );
  const darkModeEnabled =
    mode == "dark" || (mode == "system" && preferredMode == "dark");

  const contextValue = {
    darkModeEnabled,
    toggleDarkMode: () => {
      if (mode == "system" || mode == preferredMode) {
        setMode(darkModeEnabled ? "light" : "dark");
      } else {
        setMode("system");
      }
    },
  };

  useLayoutEffect(() => {
    document.documentElement.setAttribute(
      "data-color-mode",
      darkModeEnabled ? "dark" : "light",
    );
  }, [darkModeEnabled]);

  return (
    <DarkModeContext.Provider value={contextValue}>
      {children}
    </DarkModeContext.Provider>
  );
}
