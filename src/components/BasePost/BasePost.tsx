import React from "react";
import { Link } from "react-router-dom";
import { compactNumber, copyToClipboard } from "@utils";
import type { Post, PostProps } from "@types";
import { useAvatar, useBookmarkPost, useVote } from "@services/api";
import { useAuthGuard } from "@hooks";
import classNames from "classnames";
import toast from "react-hot-toast";

import {
  Card,
  DropdownMenu,
  MenuItem,
  SubmissionHeader,
  Voting,
} from "@components";
import DotsIcon from "@assets/svg/dots.svg";
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
  onCommentsButtonClick,
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
          <DropdownMenu
            alignRight
            button={
              <button className="post__control post__menu-btn">
                <DotsIcon className="post__dots-icon" />
              </button>
            }
          >
            <MenuItem
              onClick={async () => {
                const postURL = String(new URL(url, location.origin));
                await copyToClipboard(postURL);
                toast.success("Link copied");
              }}
            >
              Copy link
            </MenuItem>
          </DropdownMenu>
        </div>
        <h3
          className={classNames(
            "post__title",
            title.length >= 120 && "post__title--small",
          )}
        >
          {titleClickable ? (
            <Link className="post__link" to={url}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        <div className="post__body">{children}</div>
        {!hideFooter && (
          <div className="post__footer">
            <Link
              className="post__control"
              to={`${url}?comments`}
              onClick={onCommentsButtonClick}
            >
              <BubbleIcon className="post__control-icon" />
              <span>{compactNumber(commentCount)}</span>
            </Link>
            <button
              className="post__control"
              onClick={() => bookmark(bookmarked ? "remove" : "add")}
            >
              <BookmarkIcon
                className={classNames(
                  "post__control-icon",
                  "post__control-icon--activable",
                  bookmarked && "post__control-icon--active",
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
