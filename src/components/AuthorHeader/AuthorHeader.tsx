import React from "react";

import { Card, Stat, Avatar } from "@components";
import "./AuthorHeader.scss";

type AuthorHeaderProps = {
  description?: string;
  name: string;
  picture?: string;
  stats: {
    label: string;
    title?: string;
    value: string;
  }[];
  subscribeButton?: React.ReactNode;
};

export function AuthorHeader({
  description,
  name,
  picture,
  stats,
  subscribeButton,
}: AuthorHeaderProps) {
  return (
    <div className="author-header">
      <Card>
        <div className="author-header__body">
          <div className="author-header__picture">
            <Avatar picture={picture} />
          </div>
          <div className="author-header__header">
            <div className="author-header__name">{name}</div>
            {subscribeButton}
          </div>
          {description && (
            <div className="author-header__description">{description}</div>
          )}
          <div className="author-header__stats">
            {stats.map(({ label, title, value }) => (
              <div title={title} key={label}>
                <Stat label={label} value={value} />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
