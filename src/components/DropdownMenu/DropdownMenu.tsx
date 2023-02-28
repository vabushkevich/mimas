import React, { useState, useRef } from "react";
import { useClickOutside } from "@hooks";

import { Menu, DropdownButton, MenuItem } from "@components";
import "./DropdownMenu.scss";

type MenuItemType<T> = {
  content: React.ReactNode;
  value: T;
};

type DropdownMenuProps<T> = {
  button?: React.ReactNode;
  items: MenuItemType<T>[],
  label: (selectedItem: MenuItemType<T>) => React.ReactNode;
  selectedValue?: T;
  onSelect: (item: MenuItemType<T>) => void;
};

export function DropdownMenu<T extends string>({
  button,
  items,
  label,
  selectedValue,
  onSelect,
}: DropdownMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selectedItem = items.find((item) => item.value == selectedValue);

  useClickOutside([buttonRef, menuRef], () => setIsOpen(false));

  return (
    <div className="dropdown-menu">
      <div ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        {button || <DropdownButton>{label(selectedItem)}</DropdownButton>}
      </div>
      {isOpen && (
        <div ref={menuRef} className="dropdown-menu__menu">
          <Menu>
            {items.map((item) => (
              <MenuItem
                key={item.value}
                selected={item.value == selectedValue}
                onClick={() => {
                  setIsOpen(false);
                  onSelect(item);
                }}
              >
                {item.content}
              </MenuItem>
            ))}
          </Menu>
        </div>
      )}
    </div>
  );
}
