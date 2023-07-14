import React from "react";

import "./SidebarMenu.scss";

type SidebarMenuProps = {
  children: React.ReactNode;
};

export function SidebarMenu({ children }: SidebarMenuProps) {
  return <div className="sidebar-menu">{children}</div>;
}
