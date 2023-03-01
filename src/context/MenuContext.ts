import { createContext } from "react";
import { MenuItem } from "@types";

type MenuContextType = {
  selectable?: boolean;
  selectedItem: MenuItem;
  setSelectedItem: (item: MenuItem) => void;
  onItemClick: (value: string) => void;
  onItemRender?: (item: MenuItem) => void;
  onMenuRender?: () => void;
};

export const MenuContext = createContext<MenuContextType>(null);
