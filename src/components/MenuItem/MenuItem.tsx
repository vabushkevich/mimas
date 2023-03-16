import React, { useContext, useEffect } from "react";
import { MenuContext } from "@context";
import classNames from "classnames";

import "./MenuItem.scss";

type MenuItemProps = {
  selected?: boolean;
  value?: string;
  onClick?: (value: string) => void;
  children: React.ReactNode;
};

export function MenuItem({
  selected,
  value,
  onClick,
  children,
}: MenuItemProps) {
  const {
    selectable,
    selectedItem,
    setSelectedItem,
    onItemClick,
    onItemRender,
  } = useContext(MenuContext);

  selected ??= value != null && value == selectedItem?.value;

  useEffect(() => {
    onItemRender?.({ value, content: children });
  });

  return (
    <button
      className={classNames(
        "menu-item",
        selectable && selected && "menu-item--selected",
      )}
      onClick={() => {
        if (selectable) setSelectedItem({ value, content: children });
        onClick?.(value);
        onItemClick(value);
      }}
    >
      {children}
    </button>
  );
}
