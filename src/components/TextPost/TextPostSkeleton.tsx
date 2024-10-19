import React from "react";

import { BasePostSkeleton } from "../BasePost/BasePostSkeleton";
import { Skeleton } from "../Skeleton/Skeleton";
import { UserContent } from "../UserContent/UserContent";
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
