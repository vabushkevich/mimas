import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { useMenuContext } from "./MenuContext";

import "./MenuItem.scss";

type MenuItemProps = {
  closeOnSelect?: boolean;
  isSelected?: boolean;
  leftIcon?: React.ReactNode;
  onSelect?: () => void;
  children: React.ReactNode;
};

type MenuItemLinkProps = MenuItemProps & { href: string };

export function MenuItem(props: MenuItemProps) {
  const commonProps = useCommonProps(props);
  return <button {...commonProps} />;
}

export function MenuItemLink(props: MenuItemLinkProps) {
  const commonProps = useCommonProps(props);
  return <Link {...commonProps} to={props.href} />;
}

function useCommonProps({
  closeOnSelect,
  isSelected,
  leftIcon,
  onSelect,
  children,
}: MenuItemProps) {
  const { size, onItemSelect } = useMenuContext();

  return {
    className: classNames(
      "menu-item",
      `menu-item--size_${size}`,
      isSelected && "menu-item--selected",
    ),
    onClick: () => {
      onSelect?.();
      onItemSelect?.(closeOnSelect);
    },
    children: (
      <>
        {leftIcon && <span className="menu-item__left-icon">{leftIcon}</span>}
        {children}
      </>
    ),
  };
}
