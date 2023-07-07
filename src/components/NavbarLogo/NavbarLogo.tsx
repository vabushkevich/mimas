import React from "react";
import { Link } from "react-router-dom";

import MenuIcon from "./assets/menu.svg";
import "./NavbarLogo.scss";

type NavbarLogoProps = {
  onMenuButtonClick?: () => void;
};

export function NavbarLogo({ onMenuButtonClick }: NavbarLogoProps) {
  return (
    <div className="navbar-logo">
      <button className="navbar-logo__menu-btn" onClick={onMenuButtonClick}>
        <MenuIcon width="20" />
      </button>
      <Link className="navbar-logo__logo" to="/"></Link>
    </div>
  );
}
