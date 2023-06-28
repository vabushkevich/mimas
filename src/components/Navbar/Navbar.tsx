import React from "react";
import { useAuth, getAuthURL } from "@services/auth";
import { useIdentity } from "@services/api";

import { Button, NavbarLogo } from "@components";
import { UserMenu } from "./UserMenu";
import "./Navbar.scss";

type NavbarProps = {
  onMenuButtonClick?: () => void;
};

export function Navbar({ onMenuButtonClick }: NavbarProps) {
  const { authorized } = useAuth();
  const { data: identity } = useIdentity({ enabled: authorized });
  const user = identity?.user;

  return (
    <nav className="site-nav">
      <div className="site-nav__logo">
        <NavbarLogo onMenuButtonClick={onMenuButtonClick} />
      </div>
      <div className="site-nav__login-button">
        {authorized && user && <UserMenu user={user} />}
        {!authorized && (
          <Button onClick={() => location.assign(getAuthURL())}>
            Sign in with Reddit
          </Button>
        )}
      </div>
    </nav>
  );
}
