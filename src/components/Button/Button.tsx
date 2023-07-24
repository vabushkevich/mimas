import React from "react";

import "./Button.scss";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: "blue" | "gray";
  rightIcon?: React.ReactNode;
  size?: "sm" | "md";
  variant?: "solid" | "text";
};

export const Button = function Button({
  color = "blue",
  rightIcon,
  size = "md",
  variant = "solid",
  children,
  ...other
}: ButtonProps) {
  return (
    <button
      className={[
        "button",
        `button--color_${color}`,
        `button--size_${size}`,
        `button--variant_${variant}`,
      ].join(" ")}
      {...other}
    >
      {children}
      {rightIcon && <span className="button__right-icon">{rightIcon}</span>}
    </button>
  );
};
