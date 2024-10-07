import React, { useRef, useState } from "react";
import { useClickOutside, useIsSmallScreen } from "@hooks";
import { useSignedInUser } from "@services/api";

import { SidebarHeader } from "@components";
import { UserMenu } from "./UserMenu";
import { Search } from "./Search";
import ArrowLeftIcon from "@assets/svg/arrow-left.svg";
import MagnifierIcon from "@assets/svg/magnifier.svg";
import "./Navbar.scss";

type NavbarProps = {
  onMenuButtonClick?: () => void;
};

export function Navbar({ onMenuButtonClick }: NavbarProps) {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const isSmallScreen = useIsSmallScreen();
  const searchSectionRef = useRef<HTMLDivElement>(null);
  const signedInUser = useSignedInUser();

  useClickOutside(searchSectionRef, () => setIsSearchMode(false));

  return (
    <nav className="site-nav">
      {isSmallScreen && isSearchMode ? (
        <div className="site-nav__section" ref={searchSectionRef}>
          <button
            className="site-nav__button site-nav__section-back-btn"
            onClick={() => setIsSearchMode(false)}
          >
            <ArrowLeftIcon height="18" />
          </button>
          <div className="site-nav__section-content">
            <Search autoFocus onSubmit={() => setIsSearchMode(false)} />
          </div>
        </div>
      ) : (
        <>
          <SidebarHeader onMenuButtonClick={onMenuButtonClick} />
          <div className="site-nav__right-col">
            {isSmallScreen ? (
              <button
                className="site-nav__button"
                onClick={() => setIsSearchMode(true)}
              >
                <MagnifierIcon height="20" />
              </button>
            ) : (
              <div className="site-nav__search">
                <Search />
              </div>
            )}
            <div className="site-nav__user-menu">
              <UserMenu user={signedInUser} />
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
