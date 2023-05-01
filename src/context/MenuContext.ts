import { createContext } from "react";

type MenuContextType = {
  selectedValue: string;
  onItemClick?: (value: string) => void;
  onItemRender?: (value: string, children: React.ReactNode) => void;
};

export const MenuContext = createContext<MenuContextType>(null);
