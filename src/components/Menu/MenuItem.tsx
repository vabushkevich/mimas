import React, { useLayoutEffect } from "react";
import { useMenu } from "./MenuContext";
import classNames from "classnames";
import type { PropsWithAs } from "@types";

import "./MenuItem.scss";

type MenuItemProps = {
  closeOnClick?: boolean;
  leftIcon?: React.ReactNode;
  selected?: boolean;
  value?: string | null;
  onClick?: (value: string | null) => void;
  children: React.ReactNode;
};

export function MenuItem<T extends React.ElementType>({
  as,
  closeOnClick,
  leftIcon,
  selected,
  value = null,
  onClick,
  children,
  ...rest
}: PropsWithAs<T, MenuItemProps>) {
  const Component = as ?? "button";
  const { size, isItemSelected, onItemClick, onItemRender } = useMenu();

  useLayoutEffect(() => {
    onItemRender?.(children, value);
  }, [children, value]);

  return (
    <Component
      {...rest}
      className={classNames(
        "menu-item",
        (selected ?? isItemSelected(value)) && "menu-item--selected",
        `menu-item--size_${size}`,
      )}
      onClick={() => {
        onClick?.(value);
        onItemClick?.(value, closeOnClick);
      }}
    >
      {leftIcon && <span className="menu-item__left-icon">{leftIcon}</span>}
      {children}
    </Component>
  );
}
