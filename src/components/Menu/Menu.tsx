import React, { useState } from "react";
import { MenuContext } from "@context";

import "./Menu.scss";

export type MenuProps = {
  defaultValue?: string;
  selectable?: boolean;
  size?: "md" | "lg";
  value?: string;
  onItemClick?: (value?: string) => void;
  onItemSelect?: (content: React.ReactNode) => void;
  children: React.ReactNode;
};

export function Menu({
  defaultValue,
  selectable = false,
  size = "md",
  value,
  onItemClick,
  onItemSelect,
  children,
}: MenuProps) {
  const controllable = value != null;
  const canSelectItem = (itemValue?: string) => selectable && itemValue != null;
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    value ?? defaultValue,
  );

  if (controllable && selectedValue != value) {
    setSelectedValue(value);
  }

  const contextValue = {
    size,
    isItemSelected: (itemValue?: string) => {
      return canSelectItem(itemValue) && itemValue === selectedValue;
    },
    onItemClick: (content: React.ReactNode, itemValue?: string) => {
      if (canSelectItem(itemValue) && !controllable) {
        setSelectedValue(itemValue);
        onItemSelect?.(content);
      }
      onItemClick?.(itemValue);
    },
    onItemRender: (content: React.ReactNode, itemValue?: string) => {
      if (canSelectItem(itemValue) && itemValue === selectedValue) {
        setSelectedValue(itemValue);
        onItemSelect?.(content);
      }
    },
  };

  return (
    <MenuContext.Provider value={contextValue}>
      <div className={`menu menu--size_${size}`}>{children}</div>
    </MenuContext.Provider>
  );
}
