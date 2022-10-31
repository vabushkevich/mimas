import React, { useState, useEffect } from "react";

import { Menu, DropdownButton } from "@components";
import "./DropdownMenu.scss";

type DropdownMenuProps = {
  buttonText: string;
  children: React.ReactNode;
};

export function DropdownMenu({
  buttonText,
  children,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

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
        {buttonText}
      </DropdownButton>
      {isOpen && (
        <div className="dropdown-menu__menu">
          <Menu>{children}</Menu>
        </div>
      )}
    </div>
  );
}
