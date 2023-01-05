import React from "react";

import "./Alert.scss";

type AlertProps = {
  children: React.ReactNode;
};

export function Alert({ children }: AlertProps) {
  return <div className="alert">{children}</div>;
}
