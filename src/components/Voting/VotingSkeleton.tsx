import React from "react";

import { Skeleton } from "@components";
import "./Voting.scss";

export function VotingSkeleton() {
  return (
    <div className="voting">
      <button className="voting__down-btn"></button>
      <div className="voting__score">
        <Skeleton width={30} />
      </div>
      <button className="voting__up-btn"></button>
    </div>
  );
}
