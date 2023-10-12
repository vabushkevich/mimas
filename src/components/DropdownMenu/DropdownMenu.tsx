import React, { useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { useClickOutside } from "@hooks";
import classNames from "classnames";

import { Menu, DropdownButton } from "@components";
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
      <CSSTransition
        classNames="dropdown-menu__menu-"
        in={isOpen}
        nodeRef={menuRef}
        timeout={100}
      >
        {(state) => (
          <div
            ref={menuRef}
            className={classNames(
              "dropdown-menu__menu",
              alignRight && "dropdown-menu__menu--align-right",
              state == "exited" && "dropdown-menu__menu--hidden",
            )}
          >
            <Menu
              {...menuProps}
              onItemClick={(itemValue) => {
                onItemClick?.(itemValue);
                setIsOpen(false);
              }}
              onItemSelect={(content) => setSelectedContent(content)}
            >
              {children}
            </Menu>
          </div>
        )}
      </CSSTransition>
    </div>
  );
}
