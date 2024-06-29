import React from "react";
import classNames from "classnames";
import { hashString, pseudoRandom } from "@utils";
import { useIsImageLoading } from "@hooks";

import "./Avatar.scss";

type AvatarProps = {
  name?: string;
  shadow?: boolean;
  size?: "xs" | "sm" | "md";
  src?: string;
};

const colorPairs = [
  ["#95FFF1", "#008FBF"],
  ["#9BF8FF", "#0742CA"],
  ["#E7FF6F", "#04AD20"],
  ["#FFA6D3", "#E62747"],
  ["#FFC48A", "#F91B06"],
  ["#FFCAFF", "#6E1FD4"],
  ["#FFD557", "#F44E0D"],
  ["#FFEB8A", "#FF9500"],
  ["#FFFF80", "#74C700"],
];

export function Avatar({ shadow = true, name, size, src }: AvatarProps) {
  const isLoading = useIsImageLoading(src);
  const className = classNames([
    "avatar",
    shadow && "avatar--shadow",
    size && `avatar--size_${size}`,
  ]);
  const fallbackToInitials = !src && !!name;

  if (fallbackToInitials) {
    const nameHash = hashString(name);
    const colorPair = colorPairs[pseudoRandom(nameHash) % colorPairs.length];

    return (
      <div
        className={className}
        style={{
          background: `linear-gradient(225deg, ${colorPair[0]} -30%, ${colorPair[1]} 130%)`,
        }}
      >
        {name[0].toUpperCase()}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={src && !isLoading ? { backgroundImage: `url("${src}")` } : {}}
    ></div>
  );
}
