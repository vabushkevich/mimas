import React from "react";

import "./Menu.scss";

type MenuProps = {
  children: React.ReactNode;
};

export function Menu({ children }: MenuProps) {
  return <div className="menu">{children}</div>;
}
