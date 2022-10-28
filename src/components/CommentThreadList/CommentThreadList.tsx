import React from "react";
import { decodeEntities } from "@utils";
import { CommentThreadData, CommentThread as CommentThreadProps } from "@types";

import { CommentThread } from "@components";
import "./CommentThreadList.scss";

type CommentThreadListProps = {
  commentThreadsData: CommentThreadData[];
};

function parseCommentThread({
  author,
  created_utc,
  name,
  replies,
  score,
  body_html,
}: CommentThreadData): CommentThreadProps {
  const lastReply = replies && replies.data.children.at(-1);

  return {
    comment: {
      avatar: "",
      contentHtml: decodeEntities(body_html),
      dateCreated: created_utc * 1000,
      id: name,
      score: score,
      userName: author,
    },
    replies: parseReplies(replies),
    moreReplies: (lastReply && "children" in lastReply.data)
      ? [...lastReply.data.children]
      : [],
  };
}

function parseReplies(
  replies: CommentThreadData["replies"],
): CommentThreadProps[] {
  if (replies == "") return [];
  return replies.data.children
    .filter((item): item is { data: CommentThreadData } =>
      !("children" in item.data)
    )
    .map((item) => parseCommentThread(item.data));
}

export function CommentThreadList({
  commentThreadsData,
}: CommentThreadListProps) {
  return (
    <ol className="comment-thread-list">
      {commentThreadsData.map((commentThreadData) => {
        const props = parseCommentThread(commentThreadData);
        return (
          <li key={props.comment.id} className="comment-thread-list__item">
            <CommentThread {...props} />
          </li>
        );
      })}
    </ol>
  );
}
