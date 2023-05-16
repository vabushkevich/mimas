import { createContext, useContext } from "react";

type MenuContextType = {
  selectedValue?: string;
  onItemClick?: (value?: string) => void;
  onItemRender?: (children: React.ReactNode, value?: string) => void;
};

export const MenuContext = createContext<MenuContextType | null>(null);

export function useMenuContext() {
  const context = useContext(MenuContext);

  if (context == null) {
    throw new Error("useMenuContext was used outside of its Provider");
  }

  return context;
}
