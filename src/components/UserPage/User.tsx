import React from "react";
import { formatDistanceToNow, formatDate, compactNumber } from "@utils";
import { User } from "@types";

import { Card, Stat } from "@components";
import "./User.scss";

export function User({
  avatar,
  commentKarma,
  dateCreated,
  name,
  postKarma,
}: User) {
  return (
    <div className="user">
      <Card>
        <img className="user__avatar" src={avatar} alt="User avatar" />
        <div className="user__name">{name}</div>
        <div className="user__stats">
          <Stat
            label="Comment Carma"
            value={compactNumber(commentKarma)}
          />
          <Stat
            label="Post Carma"
            value={compactNumber(postKarma)}
          />
          <div title={formatDate(dateCreated)}>
            <Stat
              label="Account Age"
              value={formatDistanceToNow(dateCreated)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
