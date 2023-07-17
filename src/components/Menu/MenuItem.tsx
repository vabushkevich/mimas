import React, { useLayoutEffect } from "react";
import { useMenu } from "./MenuContext";
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
  const { size, isItemSelected, onItemClick, onItemRender } = useMenu();

  useLayoutEffect(() => {
    onItemRender?.(children, value);
  }, [children, value]);

  return (
    <button
      className={classNames(
        "menu-item",
        (selected ?? isItemSelected(value)) && "menu-item--selected",
        `menu-item--size_${size}`,
      )}
      onClick={() => {
        onClick?.(value);
        onItemClick?.(value);
      }}
    >
      {leftIcon && <span className="menu-item__left-icon">{leftIcon}</span>}
      {children}
    </button>
  );
}
