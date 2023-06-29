import React from "react";
import { useAuth } from "@services/auth";
import { useIdentity } from "@services/api";

import { NavbarLogo } from "@components";
import { UserMenu } from "./UserMenu";
import "./Navbar.scss";

type NavbarProps = {
  onMenuButtonClick?: () => void;
};

export function Navbar({ onMenuButtonClick }: NavbarProps) {
  const { authorized } = useAuth();
  const { data: identity } = useIdentity({ enabled: authorized });
  const user = authorized ? identity?.user : undefined;

  return (
    <nav className="site-nav">
      <NavbarLogo onMenuButtonClick={onMenuButtonClick} />
      <UserMenu user={user} />
    </nav>
  );
}
