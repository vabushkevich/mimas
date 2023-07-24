import React from "react";

import { Skeleton } from "@components";
import { DropdownButton } from "./DropdownButton";

type DropdownButtonProps = Parameters<typeof DropdownButton>[0];
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
