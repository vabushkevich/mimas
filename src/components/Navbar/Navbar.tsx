import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth, getAuthURL } from "@services/auth";
import { useIdentity } from "@services/api";

import { Button, DropdownMenu, MenuItem, Avatar } from "@components";
import "./Navbar.scss";

export function Navbar() {
  const { authorized, unauthorize } = useAuth();
  const { data: identity } = useIdentity({ enabled: authorized });
  const history = useHistory();
  const user = identity?.user;

  return (
    <nav className="site-nav">
      <Link className="site-nav__logo" to="/">
        reddit-client
      </Link>
      <div className="site-nav__login-btn">
        {authorized && user && (
          <DropdownMenu
            alignRight
            button={(
              <button className="user-menu-btn">
                <span className="user-menu-btn__picture">
                  <Avatar picture={user.avatar} size="md" />
                </span>
                <span className="user-menu-btn__icon"></span>
              </button>
            )}
          >
            <MenuItem
              onClick={() => history.push(`/user/${user.name}`)}
            >
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
