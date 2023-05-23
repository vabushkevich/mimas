import React from "react";
import { Link } from "react-router-dom";
import { compactNumber } from "@utils";
import type { Post, PostProps } from "@types";
import { useAvatar, useBookmarkPost, useVote } from "@services/api";
import { useAuthGuard } from "@hooks";
import classNames from "classnames";

import { Card, SubmissionHeader, Voting } from "@components";
import "./BasePost.scss";

type BasePostProps = PostProps<Post> & {
  children?: React.ReactNode;
};

export function BasePost({
  hideFooter = false,
  hidePin = false,
  post,
  primaryAuthorType = "subreddit",
  children,
}: BasePostProps) {
  const {
    bookmarked,
    commentCount,
    dateCreated,
    dateEdited,
    id,
    locked,
    pinned,
    score,
    subreddit,
    subredditId,
    title,
    type,
    url,
    userId,
    userName,
    voteDirection,
  } = post;

  const primaryAuthorId =
    primaryAuthorType == "subreddit" ? subredditId : userId;
  const removeBottomPadding =
    hideFooter &&
    (type != "text" || post.bodyHtml.length == 0) &&
    type != "crosspost" &&
    type != "removed" &&
    type != "link";

  const avatar = useAvatar(primaryAuthorId);
  const { mutate: mutateVote } = useVote(post);
  const { mutate: mutateBookmark } = useBookmarkPost(id);
  const vote = useAuthGuard(mutateVote);
  const bookmark = useAuthGuard(mutateBookmark);

  return (
    <Card hideOverflow>
      <div
        className={classNames(
          "post",
          removeBottomPadding && "post--no-bottom-padding",
        )}
      >
        <div className="post__header">
          <SubmissionHeader
            dateCreated={dateCreated}
            dateEdited={dateEdited}
            locked={locked}
            picture={avatar}
            pinned={!hidePin && pinned}
            primaryAuthorType={primaryAuthorType}
            subreddit={subreddit}
            userName={userName}
          />
        </div>
        <h3 className="post__title">
          <Link to={url}>{title}</Link>
        </h3>
        <div className="post__body">{children}</div>
        {!hideFooter && (
          <div className="post__footer">
            <Link className="post__comments-btn" to={url}>
              {compactNumber(commentCount)}
            </Link>
            <button
              className={classNames(
                "post__save-btn",
                bookmarked && "post__save-btn--active",
              )}
              onClick={() => bookmark(bookmarked ? "remove" : "add")}
            ></button>
            <div className="post__voting">
              <Voting
                score={score}
                voteDirection={voteDirection}
                onVote={(direction) => vote({ direction })}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
