import React from "react";
import { useHistory } from "react-router-dom";
import { useAuth, getAuthURL } from "@services/auth";
import { useIdentity } from "@services/api";
import { useDarkMode } from "@context";

import {
  Button,
  DropdownMenu,
  MenuItem,
  Avatar,
  NavbarLogo,
} from "@components";
import "./Navbar.scss";

type NavbarProps = {
  onMenuButtonClick?: () => void;
};

export function Navbar({ onMenuButtonClick }: NavbarProps) {
  const { authorized, unauthorize } = useAuth();
  const { data: identity } = useIdentity({ enabled: authorized });
  const history = useHistory();
  const user = identity?.user;

  const { darkModeEnabled, toggleDarkMode } = useDarkMode();

  return (
    <nav className="site-nav">
      <div className="site-nav__logo">
        <NavbarLogo onMenuButtonClick={onMenuButtonClick} />
      </div>
      <div className="site-nav__login-button">
        {authorized && user && (
          <DropdownMenu
            alignRight
            button={
              <button className="user-menu__button">
                <span className="user-menu__button-avatar">
                  <Avatar size="md" src={user.avatar} />
                </span>
                <span className="user-menu__button-icon"></span>
              </button>
            }
            size="lg"
          >
            <MenuItem
              leftIcon={
                <span className="user-menu__item-icon user-menu__user-icon"></span>
              }
              onClick={() => history.push(`/user/${user.name}`)}
            >
              {user.name}
            </MenuItem>
            <MenuItem
              leftIcon={
                <span
                  className={[
                    "user-menu__item-icon",
                    `user-menu__${darkModeEnabled ? "sun" : "moon"}-icon`,
                  ].join(" ")}
                ></span>
              }
              onClick={toggleDarkMode}
            >
              {darkModeEnabled ? "Light" : "Dark"} mode
            </MenuItem>
            <MenuItem
              leftIcon={
                <span className="user-menu__item-icon user-menu__out-icon"></span>
              }
              onClick={unauthorize}
            >
              Sign Out
            </MenuItem>
          </DropdownMenu>
        )}
        {!authorized && (
          <Button onClick={() => location.assign(getAuthURL())}>
            Sign in with Reddit
          </Button>
        )}
      </div>
    </nav>
  );
}
