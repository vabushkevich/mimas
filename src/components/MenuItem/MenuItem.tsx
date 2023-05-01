import React, { useContext, useLayoutEffect } from "react";
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
    selectedValue,
    onItemClick,
    onItemRender,
  } = useContext(MenuContext);

  selected ??= value === selectedValue;

  useLayoutEffect(() => {
    onItemRender?.(value, children);
  });

  return (
    <button
      className={classNames(
        "menu-item",
        selected && "menu-item--selected",
      )}
      onClick={() => {
        onClick?.(value);
        onItemClick?.(value);
      }}
    >
      {children}
    </button>
  );
}
