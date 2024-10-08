import React, { forwardRef } from "react";
import classNames from "classnames";

import "./Button.scss";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: "blue" | "clear" | "gray" | "transparent";
  icon?: React.ReactNode;
  pill?: boolean;
  rightIcon?: React.ReactNode;
  size?: "sm" | "md";
  variant?: "solid" | "text";
  width?: string | number;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const {
      color = "blue",
      icon,
      pill = false,
      rightIcon,
      size = "md",
      variant = "solid",
      width,
      children,
      ...other
    } = props;

    return (
      <button
        className={classNames(
          "button",
          `button--color_${color}`,
          `button--size_${size}`,
          `button--variant_${variant}`,
          pill && "button--pill",
          icon && "button--icon",
        )}
        ref={ref}
        style={{ width }}
        {...other}
      >
        {icon || (
          <>
            {children}
            {rightIcon && (
              <span className="button__right-icon">{rightIcon}</span>
            )}
          </>
        )}
      </button>
    );
  },
);
