import React from "react";
import { useHistory } from "react-router-dom";
import { useAuth, getAuthURL } from "@services/auth";
import { useIdentity } from "@services/api";

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

  return (
    <nav className="site-nav">
      <div className="site-nav__logo">
        <NavbarLogo onMenuButtonClick={onMenuButtonClick} />
      </div>
      <div className="site-nav__login-btn">
        {authorized && user && (
          <DropdownMenu
            alignRight
            button={
              <button className="user-menu-btn">
                <span className="user-menu-btn__avatar">
                  <Avatar size="md" src={user.avatar} />
                </span>
                <span className="user-menu-btn__icon"></span>
              </button>
            }
            size="lg"
          >
            <MenuItem onClick={() => history.push(`/user/${user.name}`)}>
              {user.name}
            </MenuItem>
            <MenuItem onClick={unauthorize}>Sign Out</MenuItem>
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
