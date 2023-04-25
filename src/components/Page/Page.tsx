import React, { useState, useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import { useLocalStorage, useMediaQuery } from "@hooks";

import { Navbar, Sidebar, Offcanvas } from "@components";
import "./Page.scss";

type PageProps = {
  children: React.ReactNode;
};

export function Page({ children }: PageProps) {
  const [isSidebarVisible, setIsSidebarVisible] =
    useLocalStorage("is-sidebar-visible", true);
  const [isOffcanvasVisible, setIsOffcanvasVisible] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width: 992px)");
  const { action, location } = useHistory();

  useLayoutEffect(() => {
    if (action == "PUSH") window.scroll({ top: 0 });
  }, [location.pathname]);

  const toggleSidebar = () => {
    if (isLargeScreen) {
      setIsSidebarVisible(!isSidebarVisible);
    } else {
      setIsOffcanvasVisible(!isOffcanvasVisible);
    }
  };

  const sidebar = isLargeScreen ? (
    isSidebarVisible && (
      <div className="page__sidebar">
        <Sidebar />
      </div>
    )
  ) : (
    isOffcanvasVisible && (
      <div className="page__offcanvas">
        <Offcanvas contained onClick={() => setIsOffcanvasVisible(false)}>
          <Sidebar />
        </Offcanvas>
      </div>
    )
  );

  return (
    <div className="page">
      <Navbar onMenuButtonClick={toggleSidebar} />
      <div className="page__layout">
        {sidebar}
        <div className="page__content">
          {children}
        </div>
      </div>
    </div>
  );
}
