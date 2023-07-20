import React, { forwardRef, ForwardedRef } from "react";
import classNames from "classnames";

import "./Button.scss";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: "blue" | "gray";
  rightIcon?: React.ReactNode;
  variant?: "solid" | "text";
};

export const Button = forwardRef(function Button(
  {
    color = "blue",
    rightIcon,
    variant = "solid",
    children,
    ...other
  }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <button
      ref={ref}
      className={classNames(
        "button",
        color && `button--color_${color}`,
        variant && `button--variant_${variant}`,
      )}
      {...other}
    >
      {children}
      {rightIcon && <span className="button__right-icon">{rightIcon}</span>}
    </button>
  );
});
