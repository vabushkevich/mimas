import React from "react";
import { useControllableState } from "@hooks";

import {
  DropdownButtonProps,
  DropdownButton,
} from "../DropdownButton/DropdownButton";
import { MenuProps, Menu } from "../Menu/Menu";
import { MenuItem } from "../Menu/MenuItem";

type SelectOption<T extends string> = {
  label: React.ReactNode;
  value: T;
};

type SelectProps<T extends string> = {
  defaultValue?: T;
  menuSize?: MenuProps["size"];
  options: SelectOption<T>[];
  placeholder?: React.ReactNode;
  value?: T | null;
  onChange?: (value: T) => void;
  onSelect?: (value: T) => void;
} & Pick<DropdownButtonProps, "color" | "pill" | "size" | "variant" | "width"> &
  Pick<MenuProps, "alignRight">;

export function Select<T extends string>({
  alignRight,
  defaultValue,
  menuSize,
  options,
  placeholder,
  value,
  onChange,
  onSelect,
  ...buttonProps
}: SelectProps<T>) {
  const [selectedValue, setSelectedValue] = useControllableState(
    value,
    defaultValue,
  );
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <Menu
      alignRight={alignRight}
      renderButton={(props) => (
        <DropdownButton {...buttonProps} {...props}>
          {selectedOption?.label ?? placeholder}
        </DropdownButton>
      )}
      size={menuSize}
    >
      {options.map((opt) => (
        <MenuItem
          isSelected={opt.value === selectedValue}
          key={opt.value}
          onSelect={() => {
            onSelect?.(opt.value);
            if (opt.value !== selectedValue) onChange?.(opt.value);
            setSelectedValue(opt.value);
          }}
        >
          {opt.label}
        </MenuItem>
      ))}
    </Menu>
  );
}
