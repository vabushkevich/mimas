import { createContext, useContext } from "react";

type MenuContextType = {
  size: "md" | "lg";
  isItemSelected: (value: string | null) => boolean;
  onItemClick?: (value: string | null, close?: boolean) => void;
  onItemRender?: (content: React.ReactNode, value: string | null) => void;
};

export const MenuContext = createContext<MenuContextType | null>(null);

export function useMenu() {
  const context = useContext(MenuContext);

  if (context == null) {
    throw new Error("useMenu was used outside of its Provider");
  }

  return context;
}
