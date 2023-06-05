import React from "react";
import classNames from "classnames";

import defaultAvatar from "./assets/default-avatar.svg";
import "./Avatar.scss";

type AvatarProps = {
  picture?: string | null;
  size?: "xs" | "sm" | "md";
};

export function Avatar({ picture, size }: AvatarProps) {
  return (
    <div
      className={classNames(["avatar", size && `avatar--size_${size}`])}
      style={{ backgroundImage: `url("${picture || defaultAvatar}")` }}
    ></div>
  );
}
