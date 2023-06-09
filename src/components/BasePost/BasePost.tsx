import React from "react";
import { Link } from "react-router-dom";
import { compactNumber } from "@utils";
import type { Post, PostProps } from "@types";
import { useAvatar, useBookmarkPost, useVote } from "@services/api";
import { useAuthGuard } from "@hooks";
import classNames from "classnames";

import { Card, SubmissionHeader, Voting } from "@components";
import BubbleIcon from "./assets/bubble.svg";
import BookmarkIcon from "./assets/bookmark.svg";
import "./BasePost.scss";

type BasePostProps = PostProps<Post> & {
  children?: React.ReactNode;
};

export function BasePost({
  hideFooter = false,
  pinned = false,
  post,
  primaryAuthorType = "subreddit",
  titleClickable = true,
  children,
}: BasePostProps) {
  const {
    bookmarked,
    commentCount,
    dateCreated,
    dateEdited,
    id,
    locked,
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
            avatar={avatar}
            dateCreated={dateCreated}
            dateEdited={dateEdited}
            locked={locked}
            pinned={pinned}
            primaryAuthorType={primaryAuthorType}
            subreddit={subreddit}
            userName={userName}
          />
        </div>
        <h3 className="post__title">
          {titleClickable ? <Link to={url}>{title}</Link> : title}
        </h3>
        <div className="post__body">{children}</div>
        {!hideFooter && (
          <div className="post__footer">
            <Link className="post__comments-btn" to={url}>
              <BubbleIcon className="post__icon" />
              {compactNumber(commentCount)}
            </Link>
            <button
              className="post__save-btn"
              onClick={() => bookmark(bookmarked ? "remove" : "add")}
            >
              <BookmarkIcon
                className={classNames(
                  "post__icon",
                  bookmarked && "post__icon--active",
                )}
              />
            </button>
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
