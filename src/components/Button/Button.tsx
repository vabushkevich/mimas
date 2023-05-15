import React, { forwardRef, ForwardedRef } from "react";

import "./Button.scss";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  rightIcon?: React.ReactNode;
};

export const Button = forwardRef(function Button(
  { rightIcon, children, ...other }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <button ref={ref} className="button" {...other}>
      {children}
      {rightIcon && <span className="button__right-icon">{rightIcon}</span>}
    </button>
  );
});
