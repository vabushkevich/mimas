import React from "react";
import { compactNumber } from "@utils";
import classNames from "classnames";
import { VoteDirection } from "@types";

import "./Voting.scss";

type VotingProps = {
  score: number;
  scoreHidden?: boolean;
  voteDirection: VoteDirection,
  onVote?: (direction: VoteDirection) => void;
};

function getVoteType(voteDirection: VoteDirection) {
  if (voteDirection == -1) return "down";
  if (voteDirection == 1) return "up";
}

export function Voting({
  score,
  scoreHidden = false,
  voteDirection,
  onVote,
}: VotingProps) {
  const voteType = getVoteType(voteDirection);
  const handleVote = (direction: VoteDirection) => {
    if (onVote) onVote(direction == voteDirection ? 0 : direction);
  };

  return (
    <div
      className={classNames(
        "voting",
        voteType && `voting--vote-${voteType}`
      )}
    >
      <button
        className="voting__down-btn"
        onClick={() => handleVote(-1)}
      ></button>
      <div className="voting__score">
        {scoreHidden ? "–" : compactNumber(score)}
      </div>
      <button
        className="voting__up-btn"
        onClick={() => handleVote(1)}
      ></button>
    </div>
  );
}
