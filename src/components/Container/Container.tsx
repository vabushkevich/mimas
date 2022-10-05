import React from "react";

import "./Container.scss";

type ContainerProps = {
  children: React.ReactNode;
};

export function Container({ children }: ContainerProps) {
  return <div className="container">{children}</div>;
}
