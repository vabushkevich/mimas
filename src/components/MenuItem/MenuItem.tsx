import React, { useLayoutEffect } from "react";
import { useMenuContext } from "@context";
import classNames from "classnames";

import "./MenuItem.scss";

type MenuItemProps = {
  selected?: boolean;
  value?: string;
  onClick?: (value?: string) => void;
  children: React.ReactNode;
};

export function MenuItem({
  selected,
  value,
  onClick,
  children,
}: MenuItemProps) {
  const { isItemSelected, onItemClick, onItemRender } = useMenuContext();

  selected ??= isItemSelected(value);

  useLayoutEffect(() => {
    onItemRender?.(children, value);
  });

  return (
    <button
      className={classNames("menu-item", selected && "menu-item--selected")}
      onClick={() => {
        onClick?.(value);
        onItemClick?.(children, value);
      }}
    >
      {children}
    </button>
  );
}
