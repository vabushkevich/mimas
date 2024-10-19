import React, { useRef, useState } from "react";
import classNames from "classnames";
import { useClickOutside } from "@hooks";

import { ScaleFade } from "../ScaleFade/ScaleFade";
import { MenuContext } from "./MenuContext";
import "./Menu.scss";

export type MenuProps = {
  alignRight?: boolean;
  closeOnSelect?: boolean;
  renderButton: (props: {
    ref: React.RefObject<HTMLButtonElement>;
    onClick: () => void;
  }) => React.ReactNode;
  size?: "md" | "lg";
  children: React.ReactNode;
};

export function Menu({
  alignRight,
  closeOnSelect = true,
  renderButton,
  size = "md",
  children,
}: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = () => setIsOpen(!isOpen);
  const handleItemSelect = (close?: boolean) => {
    if (close ?? closeOnSelect) setIsOpen(false);
  };

  const button = renderButton({ ref: buttonRef, onClick: handleButtonClick });

  useClickOutside([buttonRef, listRef], () => setIsOpen(false));

  return (
    <MenuContext.Provider value={{ size, onItemSelect: handleItemSelect }}>
      <div className="menu">
        {button}
        <div
          className={classNames(
            "menu__list",
            alignRight && "menu__list--align-right",
          )}
          ref={listRef}
        >
          <ScaleFade
            in={isOpen}
            transformOrigin={alignRight ? "top right" : "top left"}
            unmountOnExit
          >
            <div className={`menu-list menu-list--size_${size}`}>
              {children}
            </div>
          </ScaleFade>
        </div>
      </div>
    </MenuContext.Provider>
  );
}
