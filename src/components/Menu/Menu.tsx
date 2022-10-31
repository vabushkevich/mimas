import React from "react";

import "./Menu.scss";

type MenuProps = {
  children: React.ReactNode;
};

export function Menu({ children }: MenuProps) {
  return (
    <div className="menu">
      {React.Children.map(children, (child) =>
        <div className="menu__item">{child}</div>
      )}
    </div>
  );
}
