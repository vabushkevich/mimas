import React from "react";
import classNames from "classnames";

import { Card, Skeleton, StatSkeleton, ButtonSkeleton } from "@components";
import "./AuthorHeader.scss";

type AuthorHeaderSkeletonProps = {
  showDescription?: boolean;
  showSubscribeButton?: boolean;
  showTabs?: boolean;
};

export function AuthorHeaderSkeleton({
  showDescription,
  showSubscribeButton,
  showTabs,
}: AuthorHeaderSkeletonProps) {
  return (
    <div
      className={classNames(
        "author-header",
        showTabs && "author-header--has-tabs",
      )}
    >
      <Card>
        <div className="author-header__body">
          <div className="author-header__avatar">
            <Skeleton width="100%" height="100%" circle block />
          </div>
          <div className="author-header__header">
            <div className="author-header__name">
              <Skeleton width={160} />
            </div>
            <div className="author-header__button">
              {showSubscribeButton && <ButtonSkeleton contentWidth={80} />}
            </div>
          </div>
          {showDescription && (
            <div className="author-header__description">
              <Skeleton rows={2} />
            </div>
          )}
          <div className="author-header__stats">
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </div>
          {showTabs && (
            <div className="author-header__tabs">
              <div className="author-header__tab">
                <Skeleton width={50} />
              </div>
              <div className="author-header__tab">
                <Skeleton width={50} />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
