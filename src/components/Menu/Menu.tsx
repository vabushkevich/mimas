import React, { useContext, useLayoutEffect } from "react";
import { MenuContext } from "@context";

import "./Menu.scss";

type MenuProps = {
  children: React.ReactNode;
};

export function Menu({ children }: MenuProps) {
  const { onMenuRender } = useContext(MenuContext);

  useLayoutEffect(onMenuRender);

  return <div className="menu">{children}</div>;
}
