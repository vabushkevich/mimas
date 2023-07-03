import React from "react";

import { Skeleton } from "@components";
import "./Button.scss";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  contentWidth?: number;
  rightIcon?: React.ReactNode;
};

export function ButtonSkeleton({
  contentWidth = 70,
  rightIcon,
  ...other
}: ButtonProps) {
  return (
    <button className="button button--color_gray" {...other}>
      <Skeleton width={contentWidth}></Skeleton>
      {rightIcon && <span className="button__right-icon">{rightIcon}</span>}
    </button>
  );
}
