import React from "react";
import { compactNumber } from "@utils";
import classNames from "classnames";
import { VoteDirection } from "@types";

import "./Voting.scss";

type VotingProps = {
  score: number;
  scoreHidden?: boolean;
  voteDirection: VoteDirection,
};

function getVoteType(voteDirection: VoteDirection) {
  if (voteDirection == -1) return "down";
  if (voteDirection == 1) return "up";
}

export function Voting({
  score,
  scoreHidden = false,
  voteDirection,
}: VotingProps) {
  const voteType = getVoteType(voteDirection);

  return (
    <div
      className={classNames(
        "voting",
        voteType && `voting--vote-${voteType}`
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
