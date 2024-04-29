import React, { useState, useRef } from "react";
import { useClickOutside } from "@hooks";
import classNames from "classnames";

import { Menu, DropdownButton, ScaleFade } from "@components";
import "./DropdownMenu.scss";

type MenuProps = Parameters<typeof Menu>[0];
type DropdownMenuProps = MenuProps & {
  alignRight?: boolean;
  button?:
    | React.ReactNode
    | ((selectedContent: React.ReactNode) => React.ReactNode);
  label?:
    | React.ReactNode
    | ((selectedContent: React.ReactNode) => React.ReactNode);
};

export function DropdownMenu({
  alignRight = false,
  button,
  label,
  onItemClick,
  children,
  ...menuProps
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<React.ReactNode>();
  const buttonRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside([buttonRef, menuRef], () => setIsOpen(false));

  return (
    <div className="dropdown-menu">
      <div ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        {typeof button == "function" ? button(selectedContent) : button}
        {!button && label && (
          <DropdownButton>
            {typeof label == "function" ? label(selectedContent) : label}
          </DropdownButton>
        )}
      </div>
      <div
        className={classNames(
          "dropdown-menu__menu",
          alignRight && "dropdown-menu__menu--align-right",
        )}
        ref={menuRef}
      >
        <ScaleFade
          in={isOpen}
          transformOrigin={alignRight ? "top right" : "top left"}
          unmountOnHide={!menuProps.selectable}
        >
          <Menu
            {...menuProps}
            onClose={() => setIsOpen(false)}
            onItemClick={(itemValue) => onItemClick?.(itemValue)}
            onItemSelect={(content) => setSelectedContent(content)}
          >
            {children}
          </Menu>
        </ScaleFade>
      </div>
    </div>
  );
}
