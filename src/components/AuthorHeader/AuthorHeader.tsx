import React from "react";
import classNames from "classnames";
import { NavLink } from "react-router-dom";

import { Avatar } from "../Avatar/Avatar";
import { Card } from "../Card/Card";
import { ReadMore } from "../ReadMore/ReadMore";
import { Stat } from "../Stat/Stat";
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
  tabs?: {
    exact?: boolean;
    href: string;
    label: string;
  }[];
};

export function AuthorHeader({
  avatar,
  description,
  name,
  stats,
  subscribeButton,
  tabs,
}: AuthorHeaderProps) {
  return (
    <div
      className={classNames(
        "author-header",
        tabs?.length && "author-header--has-tabs",
      )}
    >
      <Card>
        <div className="author-header__body">
          <div className="author-header__avatar">
            <Avatar name={name} shadow={false} src={avatar} />
          </div>
          <div className="author-header__header">
            <div className="author-header__name">{name}</div>
            <div className="author-header__button">{subscribeButton}</div>
          </div>
          {description && (
            <div className="author-header__description">
              <ReadMore key={name} previewLines={2} text={description} />
            </div>
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
          {tabs && tabs.length > 0 && (
            <div className="author-header__tabs">
              {tabs.map(({ exact, href, label }) => (
                <NavLink
                  key={href}
                  className="author-header__tab"
                  activeClassName="author-header__tab--active"
                  to={href}
                  exact={exact}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
