import { createContext, useContext } from "react";

import { MenuProps } from "./Menu";

type MenuContextValue = {
  size: Exclude<MenuProps["size"], undefined>;
  onItemSelect: (close?: boolean) => void;
};

export const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenuContext() {
  const context = useContext(MenuContext);

  if (context == null) {
    throw new Error("useMenuContext was used outside of its Provider");
  }

  return context;
}
