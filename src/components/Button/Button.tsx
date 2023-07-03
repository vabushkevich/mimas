import React, { forwardRef, ForwardedRef } from "react";
import classNames from "classnames";

import "./Button.scss";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: "blue" | "gray";
  rightIcon?: React.ReactNode;
};

export const Button = forwardRef(function Button(
  { color = "blue", rightIcon, children, ...other }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <button
      ref={ref}
      className={classNames("button", color && `button--color_${color}`)}
      {...other}
    >
      {children}
      {rightIcon && <span className="button__right-icon">{rightIcon}</span>}
    </button>
  );
});
