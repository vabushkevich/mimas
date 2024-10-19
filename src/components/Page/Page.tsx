import React, { useState, useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  useIsLargeScreen,
  useLocalStorage,
  useNavigationType,
  useTitle,
} from "@hooks";

import { Navbar } from "../Navbar/Navbar";
import { Offcanvas } from "../Offcanvas/Offcanvas";
import { Sidebar } from "../Sidebar/Sidebar";
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
  const isLargeScreen = useIsLargeScreen();
  const { location } = useHistory();
  const navigationType = useNavigationType();

  useTitle(title && `${title} - mimas`);

  useLayoutEffect(() => {
    if (navigationType == "NAVIGATE") window.scroll({ top: 0 });
  }, [location]);

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
      <div className="page__navbar">
        <Navbar onMenuButtonClick={toggleSidebar} />
      </div>
      <div className="page__layout">
        {isSidebarOpen && sidebar}
        <div className="page__content">{children}</div>
      </div>
    </div>
  );
}
