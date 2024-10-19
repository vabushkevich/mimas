import React from "react";

import { Skeleton } from "../Skeleton/Skeleton";
import { Button, ButtonProps } from "./Button";

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
