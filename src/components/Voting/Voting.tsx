import React from "react";
import { compactNumber } from "@utils";
import classNames from "classnames";

import "./Voting.scss";

type VotingProps = {
  score: number;
  scoreHidden?: boolean;
  vote?: "up" | "down";
};

export function Voting({
  score,
  scoreHidden = false,
  vote,
}: VotingProps) {
  return (
    <div
      className={classNames(
        "voting",
        vote && `voting--vote-${vote}`
      )}
    >
      <button className="voting__down-btn"></button>
      <div className="voting__score">
        {scoreHidden ? "–" : compactNumber(score)}
      </div>
      <button className="voting__up-btn"></button>
    </div>
  );
}
