import React from "react";
import classNames from "classnames";

import "./Button.scss";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: "blue" | "clear" | "gray";
  pill?: boolean;
  rightIcon?: React.ReactNode;
  size?: "sm" | "md";
  variant?: "solid" | "text";
};

export const Button = function Button({
  color = "blue",
  pill = false,
  rightIcon,
  size = "md",
  variant = "solid",
  children,
  ...other
}: ButtonProps) {
  return (
    <button
      className={classNames(
        "button",
        `button--color_${color}`,
        `button--size_${size}`,
        `button--variant_${variant}`,
        pill && "button--pill",
      )}
      {...other}
    >
      {children}
      {rightIcon && <span className="button__right-icon">{rightIcon}</span>}
    </button>
  );
};
