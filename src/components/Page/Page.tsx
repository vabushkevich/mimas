import React, { useState, useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  useLocalStorage,
  useMediaQuery,
  useNavigationType,
  useTitle,
} from "@hooks";

import { Navbar, Sidebar, Offcanvas } from "@components";
import "./Page.scss";

type PageProps = {
  title?: string;
  children: React.ReactNode;
};

export function Page({ title, children }: PageProps) {
  const [isPageSidebarOpen, setIsPageSidebarOpen] = useLocalStorage(
    "is-sidebar-open",
    true,
  );
  const [isOffcanvasSidebarOpen, setIsOffcanvasSidebarOpen] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width: 992px)");
  const { location } = useHistory();
  const navigationType = useNavigationType();

  useTitle(title && `${title} - mimas`);

  useLayoutEffect(() => {
    if (navigationType == "NAVIGATE") window.scroll({ top: 0 });
  }, [location.pathname]);

  const toggleSidebar = () => {
    if (isLargeScreen) {
      setIsPageSidebarOpen(!isPageSidebarOpen);
    } else {
      setIsOffcanvasSidebarOpen(!isOffcanvasSidebarOpen);
    }
  };

  const sidebar = isLargeScreen ? (
    <div className="page__sidebar">
      <Sidebar />
    </div>
  ) : (
    <Offcanvas onClick={() => setIsOffcanvasSidebarOpen(false)}>
      <Sidebar showHeader />
    </Offcanvas>
  );
  const isSidebarOpen = isLargeScreen
    ? isPageSidebarOpen
    : isOffcanvasSidebarOpen;

  return (
    <div className="page">
      <Navbar onMenuButtonClick={toggleSidebar} />
      <div className="page__layout">
        {isSidebarOpen && sidebar}
        <div className="page__content">{children}</div>
      </div>
    </div>
  );
}
