import React from "react";

import "./Button.scss";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  rightIcon?: React.ReactNode;
};

export function Button({
  rightIcon,
  children,
  ...other
}: ButtonProps) {
  return (
    <button className="button" {...other}>
      {children}
      {rightIcon && <span className="button__right-icon">{rightIcon}</span>}
    </button >
  );
}
