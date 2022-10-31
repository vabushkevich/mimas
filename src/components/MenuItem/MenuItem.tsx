import React from "react";
import classNames from "classnames";

import "./MenuItem.scss";

type MenuItemProps = {
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

export function MenuItem({
  children,
  selected,
  onClick,
}: MenuItemProps) {
  return (
    <button
      className={classNames(
        "menu-item",
        selected && "menu-item--selected",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
