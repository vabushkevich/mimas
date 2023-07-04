import { useLocalStorage, useMediaQuery } from "@hooks";
import React, { createContext, useContext, useLayoutEffect } from "react";
import { useTransitions } from "./TransitionsContext";
import type { ColorMode } from "@types";

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
  const { disableTransitions, enableTransitions } = useTransitions();

  const preferredMode = useMediaQuery("(prefers-color-scheme: dark)")
    ? "dark"
    : "light";
  const [mode, setMode] = useLocalStorage<ColorMode>("color-mode", "system");
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
    disableTransitions();

    document.documentElement.setAttribute(
      "data-color-mode",
      darkModeEnabled ? "dark" : "light",
    );

    setTimeout(enableTransitions);
  }, [darkModeEnabled]);

  return (
    <DarkModeContext.Provider value={contextValue}>
      {children}
    </DarkModeContext.Provider>
  );
}
