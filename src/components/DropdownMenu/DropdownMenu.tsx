import React, { useState, useRef, useMemo, useCallback } from "react";
import { useClickOutside } from "@hooks";
import { MenuContext } from "@context";
import { MenuItem } from "@types";
import classNames from "classnames";

import { Menu, DropdownButton } from "@components";
import "./DropdownMenu.scss";

type DropdownMenuProps = {
  alignRight?: boolean;
  button?: React.ReactNode | ((selectedItem: MenuItem) => React.ReactNode);
  defaultValue?: string;
  label?: React.ReactNode | ((selectedItem: MenuItem) => React.ReactNode);
  selectable?: boolean;
  onSelect?: (value: string) => void;
  children: React.ReactNode;
};

export function DropdownMenu({
  alignRight = false,
  button,
  defaultValue,
  label,
  selectable = false,
  onSelect,
  children,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem>(null);
  const menu = <Menu>{children}</Menu>;
  const buttonRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [menuInitialized, setMenuInitialized] = useState(false);
  const shouldSelectDefaultItem = selectable
    && defaultValue != null
    && !selectedItem;

  // During the initial component rendering we have to prerender the menu to be
  // able to select the default item.
  const shouldMenuInitialize = shouldSelectDefaultItem && !menuInitialized;

  const onItemClick = useCallback((value: string) => {
    onSelect?.(value);
    setIsOpen(false);
  }, [onSelect]);

  const onMenuRender = useCallback(() => {
    if (!menuInitialized) setMenuInitialized(true);
  }, [menuInitialized]);

  const onItemRender = useCallback(({ value, content }) => {
    // Select default item if necessary and possible
    if (shouldSelectDefaultItem && value != null && value == defaultValue) {
      setSelectedItem({ value, content });
    }
  }, [defaultValue, selectable, selectedItem]);

  const contextValue = useMemo(() => ({
    selectable,
    selectedItem,
    setSelectedItem,
    onItemClick,
    onItemRender,
    onMenuRender,
  }), [
    selectable,
    selectedItem,
    setSelectedItem,
    onItemClick,
    onItemRender,
    onMenuRender,
  ]);

  useClickOutside([buttonRef, menuRef], () => setIsOpen(false));

  return (
    <MenuContext.Provider value={contextValue}>
      {shouldMenuInitialize ? (
        <div style={{ display: "none" }}>{menu}</div>
      ) : (
        <div className="dropdown-menu">
          <div ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
            {button && typeof button == "function"
              ? button(selectedItem)
              : button
            }
            {!button && label && (
              <DropdownButton>
                {typeof label == "function" ? label(selectedItem) : label}
              </DropdownButton>
            )}
          </div>
          {isOpen && (
            <div
              ref={menuRef}
              className={classNames(
                "dropdown-menu__menu",
                alignRight && "dropdown-menu__menu--align-right",
              )}
            >
              {menu}
            </div>
          )}
        </div>
      )}
    </MenuContext.Provider>
  );
}
