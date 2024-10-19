import React from "react";

import { Skeleton } from "../Skeleton/Skeleton";
import { DropdownButton, DropdownButtonProps } from "./DropdownButton";

type DropdownButtonSkeletonProps = Omit<DropdownButtonProps, "children"> & {
  contentWidth?: number;
};

export function DropdownButtonSkeleton({
  contentWidth = 70,
  ...other
}: DropdownButtonSkeletonProps) {
  return (
    <DropdownButton color="gray" {...other}>
      <Skeleton width={contentWidth}></Skeleton>
    </DropdownButton>
  );
}
