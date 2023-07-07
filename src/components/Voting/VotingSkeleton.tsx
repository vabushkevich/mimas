import React from "react";

import { Skeleton } from "@components";
import UpIcon from "@assets/svg/arrow-up.svg";
import DownIcon from "@assets/svg/arrow-down.svg";
import "./Voting.scss";

export function VotingSkeleton() {
  return (
    <div className="voting">
      <button className="voting__up-btn">
        <UpIcon className="voting__icon" />
      </button>
      <div className="voting__score">
        <Skeleton width={30} />
      </div>
      <button className="voting__down-btn">
        <DownIcon className="voting__icon" />
      </button>
    </div>
  );
}
