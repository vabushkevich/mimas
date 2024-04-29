import { createContext, useContext } from "react";

type MenuContextType = {
  size: "md" | "lg";
  isItemSelected: (value?: string) => boolean;
  onItemClick?: (value?: string, close?: boolean) => void;
  onItemRender?: (content: React.ReactNode, value?: string) => void;
};

export const MenuContext = createContext<MenuContextType | null>(null);

export function useMenu() {
  const context = useContext(MenuContext);

  if (context == null) {
    throw new Error("useMenu was used outside of its Provider");
  }

  return context;
}
