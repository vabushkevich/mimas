import React, { useLayoutEffect } from "react";
import { useMenuContext } from "@context";
import classNames from "classnames";

import "./MenuItem.scss";

type MenuItemProps = {
  leftIcon?: React.ReactNode;
  selected?: boolean;
  value?: string;
  onClick?: (value?: string) => void;
  children: React.ReactNode;
};

export function MenuItem({
  leftIcon,
  selected,
  value,
  onClick,
  children,
}: MenuItemProps) {
  const { size, isItemSelected, onItemClick, onItemRender } = useMenuContext();

  selected ??= isItemSelected(value);

  useLayoutEffect(() => {
    onItemRender?.(children, value);
  });

  return (
    <button
      className={classNames(
        "menu-item",
        selected && "menu-item--selected",
        `menu-item--size_${size}`,
      )}
      onClick={() => {
        onClick?.(value);
        onItemClick?.(children, value);
      }}
    >
      {leftIcon && <span className="menu-item__left-icon">{leftIcon}</span>}
      {children}
    </button>
  );
}
