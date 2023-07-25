import React from "react";

import { Card, Stat, Avatar } from "@components";
import "./AuthorHeader.scss";

type AuthorHeaderProps = {
  avatar?: string;
  description?: string;
  name: string;
  stats?: {
    label: string;
    title?: string;
    value: string;
  }[];
  subscribeButton?: React.ReactNode;
};

export function AuthorHeader({
  avatar,
  description,
  name,
  stats,
  subscribeButton,
}: AuthorHeaderProps) {
  return (
    <div className="author-header">
      <Card>
        <div className="author-header__body">
          <div className="author-header__avatar">
            <Avatar name={name} src={avatar} />
          </div>
          <div className="author-header__header">
            <div className="author-header__name">{name}</div>
            <div className="author-header__button">{subscribeButton}</div>
          </div>
          {description && (
            <div className="author-header__description">{description}</div>
          )}
          {stats && stats.length > 0 && (
            <div className="author-header__stats">
              {stats.map(({ label, title, value }) => (
                <div title={title} key={label}>
                  <Stat label={label} value={value} />
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
