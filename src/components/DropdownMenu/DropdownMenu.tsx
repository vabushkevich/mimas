import React, { useState, useRef } from "react";
import { useClickOutside } from "@hooks";
import { MenuContext } from "@context";
import classNames from "classnames";

import { Menu, DropdownButton } from "@components";
import "./DropdownMenu.scss";

type DropdownMenuProps = {
  alignRight?: boolean;
  button?:
    | React.ReactNode
    | ((selectedContent: React.ReactNode) => React.ReactNode);
  defaultValue?: string;
  label?:
    | React.ReactNode
    | ((selectedContent: React.ReactNode) => React.ReactNode);
  selectable?: boolean;
  value?: string;
  onItemClick?: (value: string) => void;
  children: React.ReactNode;
};

export function DropdownMenu({
  alignRight = false,
  button,
  defaultValue,
  label,
  selectable = false,
  value,
  onItemClick,
  children,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userSelectedValue, setUserSelectedValue] = useState<string>(null);
  const [selectedContent, setSelectedContent] =
    useState<React.ReactNode>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selectedValue = selectable
    ? value || userSelectedValue || defaultValue
    : null;

  const contextValue = {
    selectedValue,
    onItemRender: (value: string, children: React.ReactNode) => {
      if (value === selectedValue) setSelectedContent(children);
    },
    onItemClick: (itemValue: string) => {
      if (selectable && value == null) setUserSelectedValue(itemValue);
      onItemClick?.(itemValue);
      setIsOpen(false);
    },
  };

  useClickOutside([buttonRef, menuRef], () => setIsOpen(false));

  return (
    <MenuContext.Provider value={contextValue}>
      <div className="dropdown-menu">
        <div ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
          {button && (
            typeof button == "function"
              ? button(selectedContent)
              : button
          )}
          {!button && label && (
            <DropdownButton>
              {typeof label == "function" ? label(selectedContent) : label}
            </DropdownButton>
          )}
        </div>
        <div
          ref={menuRef}
          className={classNames(
            "dropdown-menu__menu",
            !isOpen && "dropdown-menu__menu--hidden",
            alignRight && "dropdown-menu__menu--align-right",
          )}
        >
          <Menu>
            {children}
          </Menu>
        </div>
      </div>
    </MenuContext.Provider>
  );
}
