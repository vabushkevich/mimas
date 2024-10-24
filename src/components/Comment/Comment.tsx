import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import type { Comment } from "@types";
import { capitalize } from "lodash-es";
import {
  useAvatar,
  useDeleteComment,
  useSignedInUser,
  useVote,
} from "@services/api";
import { useAuthGuard } from "@hooks";
import { copyToClipboard } from "@utils";

import { CommentForm } from "../CommentForm/CommentForm";
import { Menu } from "../Menu/Menu";
import { MenuItem } from "../Menu/MenuItem";
import { SubmissionHeader } from "../SubmissionHeader/SubmissionHeader";
import { UserContent } from "../UserContent/UserContent";
import { Voting } from "../Voting/Voting";
import PencilIcon from "./assets/pencil.svg";
import LinkIcon from "@assets/svg/link.svg";
import TrashIcon from "./assets/trash.svg";
import DotsIcon from "@assets/svg/dots.svg";
import "./Comment.scss";

type CommentProps = {
  collapsed?: boolean;
  comment: Comment;
  hideDistinction?: boolean;
  hideFlair?: boolean;
  hideLock?: boolean;
  hidePin?: boolean;
  replyInline?: boolean;
  showSubreddit?: boolean;
  onReplyButtonClick?: () => void;
};

export function Comment({
  collapsed = false,
  comment,
  hideDistinction,
  hideFlair,
  hideLock,
  hidePin,
  replyInline = true,
  showSubreddit,
  onReplyButtonClick,
}: CommentProps) {
  const {
    bodyHtml,
    bodyText,
    bySubmitter,
    dateCreated,
    dateEdited,
    deletedBy,
    distinction,
    id,
    locked,
    pinned,
    score,
    scoreHidden,
    subreddit,
    subredditId,
    url,
    userFlair,
    userId,
    userName,
    voteDirection,
  } = comment;

  const primaryAuthorId = showSubreddit ? subredditId : userId;

  const [isEdit, setIsEdit] = useState(false);
  const avatar = useAvatar(primaryAuthorId);
  const vote = useAuthGuard(useVote(comment).mutate);
  const deleteComment = useAuthGuard(useDeleteComment().mutate);
  const signedInUser = useSignedInUser();
  const bySignedInUser = signedInUser && signedInUser.id == userId;
  const disableEditing = () => setIsEdit(false);

  if (deletedBy) {
    return (
      <div className="comment comment--deleted">
        {capitalize(deletedBy)} removed comment
      </div>
    );
  }

  return (
    <div className="comment">
      <SubmissionHeader
        avatar={avatar}
        bySubmitter={!hideDistinction ? bySubmitter : undefined}
        dateCreated={dateCreated}
        dateEdited={dateEdited}
        distinction={!hideDistinction ? distinction : undefined}
        flair={!hideFlair ? userFlair : undefined}
        locked={!hideLock && locked}
        pinned={!hidePin && pinned}
        subreddit={showSubreddit ? subreddit : undefined}
        url={url}
        userName={userName}
      />
      {!collapsed && (
        <>
          <div className="comment__body">
            {isEdit ? (
              <CommentForm
                autoFocus
                cancelable
                initialText={bodyText}
                targetId={id}
                onCancel={disableEditing}
                onSubmit={disableEditing}
                isEdit
              />
            ) : (
              <UserContent html={bodyHtml} />
            )}
          </div>
          {!isEdit && (
            <div className="comment__footer">
              {replyInline ? (
                <button
                  className="comment__control comment__reply-btn"
                  disabled={locked}
                  onClick={onReplyButtonClick}
                >
                  Reply
                </button>
              ) : (
                <Link className="comment__control comment__reply-btn" to={url}>
                  Reply
                </Link>
              )}
              <div className="comment__menu">
                <Menu
                  renderButton={(props) => (
                    <button
                      {...props}
                      className="comment__control comment__menu-btn"
                    >
                      <DotsIcon className="comment__dots-icon" />
                    </button>
                  )}
                >
                  {bySignedInUser && (
                    <MenuItem
                      leftIcon={<PencilIcon />}
                      onSelect={() => setIsEdit(true)}
                    >
                      Edit
                    </MenuItem>
                  )}
                  <MenuItem
                    leftIcon={<LinkIcon />}
                    onSelect={async () => {
                      const commentURL = String(new URL(url, location.origin));
                      await copyToClipboard(commentURL);
                      toast.success("Link copied");
                    }}
                  >
                    Copy link
                  </MenuItem>
                  {bySignedInUser && (
                    <MenuItem
                      leftIcon={<TrashIcon />}
                      onSelect={() => deleteComment({ id })}
                    >
                      Delete
                    </MenuItem>
                  )}
                </Menu>
              </div>
              <div className="comment__voting">
                <Voting
                  score={score}
                  scoreHidden={scoreHidden}
                  voteDirection={voteDirection}
                  onVote={(direction) => vote({ direction })}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
