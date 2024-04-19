import React from "react";
import { Link } from "react-router-dom";

import MenuIcon from "./assets/menu.svg";
import "./SidebarHeader.scss";

type SidebarHeaderProps = {
  onMenuButtonClick?: () => void;
};

export function SidebarHeader({ onMenuButtonClick }: SidebarHeaderProps) {
  return (
    <div className="sidebar-header">
      <button className="sidebar-header__menu-btn" onClick={onMenuButtonClick}>
        <MenuIcon height="15" />
      </button>
      <Link className="sidebar-header__logo" to="/"></Link>
    </div>
  );
}
