import React from "react";
import classNames from "classnames";

import defaultAvatar from "./assets/default-avatar.svg";
import "./Avatar.scss";

type AvatarProps = {
  picture?: string;
  size?: "xs" | "sm" | "md";
};

export function Avatar({ picture = defaultAvatar, size }: AvatarProps) {
  return (
    <div
      className={classNames(["avatar", size && `avatar--size_${size}`])}
      style={{ backgroundImage: `url("${picture}")` }}
    ></div>
  );
}
