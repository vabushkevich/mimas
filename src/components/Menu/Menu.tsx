import React, { useLayoutEffect, useRef, useState } from "react";
import { MenuContext } from "./MenuContext";

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
  const contentsRef = useRef<Record<string, React.ReactNode>>({});
  const [selectedValue, setSelectedValue] = useState(value ?? defaultValue);

  useLayoutEffect(() => {
    if (controllable) setSelectedValue(value);
  }, [value]);

  useLayoutEffect(() => {
    const selectedContent = selectedValue
      ? contentsRef.current[selectedValue]
      : null;
    onItemSelect?.(selectedContent);
  }, [selectedValue]);

  const contextValue = {
    size,
    isItemSelected: (itemValue?: string) => {
      return selectable && itemValue != null && itemValue == selectedValue;
    },
    onItemClick: (itemValue?: string) => {
      if (selectable && !controllable) setSelectedValue(itemValue);
      onItemClick?.(itemValue);
    },
    onItemRender: (content: React.ReactNode, itemValue?: string) => {
      if (itemValue != null) contentsRef.current[itemValue] = content;
    },
  };

  return (
    <MenuContext.Provider value={contextValue}>
      <div className={`menu menu--size_${size}`}>{children}</div>
    </MenuContext.Provider>
  );
}
