import React from "react";

import { BasePostSkeleton, Skeleton, UserContent } from "@components";
import "./TextPost.scss";

export function TextPostSkeleton() {
  return (
    <BasePostSkeleton>
      <div className="text-post-body">
        <UserContent>
          <Skeleton rows={4} />
        </UserContent>
      </div>
    </BasePostSkeleton>
  );
}
