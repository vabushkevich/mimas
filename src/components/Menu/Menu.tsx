import React, { useContext, useEffect } from "react";
import { MenuContext } from "@context";

import "./Menu.scss";

type MenuProps = {
  children: React.ReactNode;
};

export function Menu({ children }: MenuProps) {
  const { onMenuRender } = useContext(MenuContext);

  useEffect(onMenuRender);

  return <div className="menu">{children}</div>;
}
