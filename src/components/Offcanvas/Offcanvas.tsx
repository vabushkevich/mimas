import React from "react";

import "./Offcanvas.scss";

type OffcanvasProps = {
  onClick?: () => void;
  children: React.ReactNode;
};

export function Offcanvas({ onClick, children }: OffcanvasProps) {
  return (
    <div className="offcanvas" onClick={onClick}>
      <div className="offcanvas__backdrop"></div>
      <div className="offcanvas__body">{children}</div>
    </div>
  );
}
