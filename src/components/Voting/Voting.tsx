import React from "react";
import { compactNumber } from "@utils";
import classNames from "classnames";
import { VoteDirection } from "@types";

import UpIcon from "@assets/svg/arrow-up.svg";
import DownIcon from "@assets/svg/arrow-down.svg";
import "./Voting.scss";

type VotingProps = {
  score: number;
  scoreHidden?: boolean;
  voteDirection: VoteDirection;
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
    onVote?.(direction == voteDirection ? 0 : direction);
  };

  return (
    <div
      className={classNames("voting", voteType && `voting--vote-${voteType}`)}
    >
      <button className="voting__up-btn" onClick={() => handleVote(1)}>
        <UpIcon className="voting__icon" />
      </button>
      <div className="voting__score">
        {scoreHidden ? "–" : compactNumber(score)}
      </div>
      <button className="voting__down-btn" onClick={() => handleVote(-1)}>
        <DownIcon className="voting__icon" />
      </button>
    </div>
  );
}
