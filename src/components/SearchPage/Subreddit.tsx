import React from "react";
import { Link } from "react-router-dom";
import { compactNumber } from "@utils";
import { Subreddit as SubredditType } from "@types";

import { Avatar, Card } from "@components";
import "./Subreddit.scss";

export function Subreddit({ subreddit }: { subreddit: SubredditType }) {
  return (
    <Link className="subreddit" to={`/r/${subreddit.name}`}>
      <Card>
        <div className="subreddit__body">
          <div className="subreddit__avatar">
            <Avatar src={subreddit.avatar} name={subreddit.name} />
          </div>
          <div className="subreddit__info">
            <div className="subreddit__name">r/{subreddit.name}</div>
            <div className="subreddit__member-count">
              {subreddit.private
                ? "Private subreddit"
                : `${compactNumber(subreddit.subscribers)} members`}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
