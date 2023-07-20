import React from "react";

import { Skeleton } from "@components";
import { Button } from "./Button";

type ButtonProps = Parameters<typeof Button>[0];
type ButtonSkeletonProps = Omit<ButtonProps, "children"> & {
  contentWidth?: number;
};

export function ButtonSkeleton({
  contentWidth = 70,
  ...other
}: ButtonSkeletonProps) {
  return (
    <Button color="gray" {...other}>
      <Skeleton width={contentWidth}></Skeleton>
    </Button>
  );
}
