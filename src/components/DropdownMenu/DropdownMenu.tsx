import React, { useState, useEffect } from "react";

import { Menu, DropdownButton, MenuItem } from "@components";
import "./DropdownMenu.scss";

type MenuItemType<T> = {
  content: React.ReactNode;
  value: T;
};

type DropdownMenuProps<T> = {
  items: MenuItemType<T>[],
  label: (selectedItem: MenuItemType<T>) => React.ReactNode;
  selectedValue?: T;
  onSelect: (item: MenuItemType<T>) => void;
};

export function DropdownMenu<T extends string>({
  items,
  label,
  selectedValue,
  onSelect,
}: DropdownMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedItem = items.find((item) => item.value == selectedValue);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = () => setIsOpen(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isOpen]);

  return (
    <div className="dropdown-menu">
      <DropdownButton
        onClick={() => setIsOpen((isOpen) => !isOpen)}
      >
        {label(selectedItem)}
      </DropdownButton>
      {isOpen && (
        <div className="dropdown-menu__menu">
          <Menu>
            {items.map((item) => (
              <MenuItem
                key={item.value}
                selected={item.value == selectedValue}
                onClick={() => onSelect(item)}
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
