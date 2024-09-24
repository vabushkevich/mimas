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
  Flair,
  Menu,
  MenuItem,
  SubmissionHeader,
  UserContent,
  Voting,
} from "@components";
import LinkIcon from "@assets/svg/link.svg";
import DotsIcon from "@assets/svg/dots.svg";
import BubbleIcon from "./assets/bubble.svg";
import BookmarkIcon from "./assets/bookmark.svg";
import "./BasePost.scss";

type BasePostProps = PostProps<Post> & {
  children?: React.ReactNode;
};

export function BasePost({
  hideFlair = false,
  hideFooter = false,
  pinned = false,
  post,
  showAdditionalText,
  showSubreddit = true,
  titleClickable = true,
  onCommentsButtonClick,
  children,
}: BasePostProps) {
  const {
    additionalTextHtml,
    bookmarked,
    commentCount,
    dateCreated,
    dateEdited,
    flair,
    id,
    locked,
    score,
    subreddit,
    subredditId,
    title,
    type,
    url,
    userFlair,
    userId,
    userName,
    voteDirection,
  } = post;

  const primaryAuthorId = showSubreddit ? subredditId : userId;
  const removeBottomPadding =
    hideFooter &&
    (type != "text" || post.bodyHtml.length == 0) &&
    type != "crosspost" &&
    type != "removed" &&
    type != "link";

  const avatar = useAvatar(primaryAuthorId);
  const vote = useAuthGuard(useVote(post).mutate);
  const bookmark = useAuthGuard(useBookmarkPost(id).mutate);

  const headingChildren = (
    <>
      <h3
        className={classNames(
          "post__title",
          title.length >= 120 && "post__title--small",
        )}
      >
        {title}{" "}
      </h3>
      {flair && !hideFlair && <Flair className="post__flair" text={flair} />}
    </>
  );

  return (
    <Card border={hideFooter} hideOverflow={hideFooter}>
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
            flair={!hideFlair ? userFlair : undefined}
            locked={locked}
            pinned={pinned}
            subreddit={showSubreddit ? subreddit : undefined}
            userName={userName}
          />
          <Menu
            alignRight
            renderButton={(props) => (
              <button {...props} className="post__control post__menu-btn">
                <DotsIcon className="post__dots-icon" />
              </button>
            )}
          >
            <MenuItem
              leftIcon={<LinkIcon />}
              onSelect={async () => {
                const postURL = String(new URL(url, location.origin));
                await copyToClipboard(postURL);
                toast.success("Link copied");
              }}
            >
              Copy link
            </MenuItem>
          </Menu>
        </div>
        <div className="post__heading">
          {titleClickable ? (
            <Link className="post__link" to={url}>
              {headingChildren}
            </Link>
          ) : (
            headingChildren
          )}
        </div>
        <div className="post__body">
          {children}
          {showAdditionalText && additionalTextHtml && (
            <div className="post__additional-text">
              <UserContent html={additionalTextHtml} />
            </div>
          )}
        </div>
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
