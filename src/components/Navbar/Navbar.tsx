import React, { useRef, useState } from "react";
import { useClickOutside, useMediaQuery } from "@hooks";
import { useAuth } from "@services/auth";
import { useIdentity } from "@services/api";

import { NavbarLogo } from "@components";
import { UserMenu } from "./UserMenu";
import { Search } from "./Search";
import MagnifierIcon from "@assets/svg/magnifier.svg";
import "./Navbar.scss";

type NavbarProps = {
  onMenuButtonClick?: () => void;
};

export function Navbar({ onMenuButtonClick }: NavbarProps) {
  const { authorized } = useAuth();
  const [isSearchMode, setIsSearchMode] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 576px)");
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { data: identity } = useIdentity({ enabled: authorized });
  const user = authorized ? identity?.user : undefined;

  useClickOutside([searchButtonRef, searchRef], () => setIsSearchMode(false));

  return (
    <nav className="site-nav">
      <div className="site-nav__row site-nav__row--main">
        <NavbarLogo onMenuButtonClick={onMenuButtonClick} />
        <div className="site-nav__right-col">
          {isSmallScreen ? (
            <button
              className="site-nav__search-btn"
              ref={searchButtonRef}
              onClick={() => setIsSearchMode(!isSearchMode)}
            >
              <MagnifierIcon width="20" />
            </button>
          ) : (
            <div className="site-nav__search">
              <Search />
            </div>
          )}
          <div className="site-nav__user-menu">
            <UserMenu user={user} />
          </div>
        </div>
      </div>
      {isSmallScreen && isSearchMode && (
        <div className="site-nav__row site-nav__row--search" ref={searchRef}>
          <Search autoFocus onSubmit={() => setIsSearchMode(false)} />
        </div>
      )}
    </nav>
  );
}
