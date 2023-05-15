import React from "react";
import classNames from "classnames";

import "./Offcanvas.scss";

type OffcanvasProps = {
  contained?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

export function Offcanvas({
  contained = false,
  onClick,
  children,
}: OffcanvasProps) {
  return (
    <div
      className={classNames("offcanvas", contained && "offcanvas--contained")}
      onClick={onClick}
    >
      <div className="offcanvas__backdrop"></div>
      <div className="offcanvas__body">{children}</div>
    </div>
  );
}
