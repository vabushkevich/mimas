import React, { useLayoutEffect, useRef } from "react";
import { useControllableState } from "@hooks";
import { MenuContext } from "./MenuContext";

import "./Menu.scss";

type MenuProps = {
  closeOnClick?: boolean;
  defaultValue?: string | null;
  selectable?: boolean;
  size?: "md" | "lg";
  value?: string | null;
  onClose?: () => void;
  onItemClick?: (value: string | null) => void;
  onItemSelect?: (content: React.ReactNode) => void;
  children: React.ReactNode;
};

export function Menu({
  closeOnClick = true,
  defaultValue,
  selectable = false,
  size = "md",
  value,
  onClose,
  onItemClick,
  onItemSelect,
  children,
}: MenuProps) {
  const contentsRef = useRef<Record<string, React.ReactNode>>({});
  const [selectedValue, setSelectedValue] = useControllableState(
    value,
    defaultValue,
  );

  useLayoutEffect(() => {
    const selectedContent = selectedValue
      ? contentsRef.current[selectedValue]
      : null;
    onItemSelect?.(selectedContent);
  }, [selectedValue]);

  const contextValue = {
    size,
    isItemSelected: (itemValue: string | null) => {
      return selectable && itemValue != null && itemValue == selectedValue;
    },
    onItemClick: (itemValue: string | null, close?: boolean) => {
      if (selectable) setSelectedValue(itemValue);
      onItemClick?.(itemValue);
      if (close ?? closeOnClick) onClose?.();
    },
    onItemRender: (content: React.ReactNode, itemValue: string | null) => {
      if (itemValue != null) contentsRef.current[itemValue] = content;
    },
  };

  return (
    <MenuContext.Provider value={contextValue}>
      <div className={`menu menu--size_${size}`}>{children}</div>
    </MenuContext.Provider>
  );
}
