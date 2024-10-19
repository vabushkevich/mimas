import React from "react";

import { Skeleton } from "../Skeleton/Skeleton";
import "./Stat.scss";

export function StatSkeleton() {
  return (
    <div className="stat">
      <div className="stat__value">
        <Skeleton width={35} />
      </div>
      <div className="stat__label">
        <Skeleton width={62} />
      </div>
    </div>
  );
}
