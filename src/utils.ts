import {
  AuthorType,
  Comment,
  IdPrefix,
  IdType,
  Submission,
} from "@types";

const idPrefixTypePairs: [IdPrefix, IdType][] = [
  ["t1", "comment"],
  ["t2", "user"],
  ["t3", "post"],
  ["t4", "message"],
  ["t5", "subreddit"],
  ["t6", "award"],
];

const idTypes = Object.fromEntries(
  idPrefixTypePairs
) as Record<IdPrefix, IdType>;

const idPrefixes = Object.fromEntries(
  idPrefixTypePairs.map(([prefix, type]) => [type, prefix])
) as Record<IdType, IdPrefix>;

const msInSecond = 1000;
const msInMinute = msInSecond * 60;
const msInHour = msInMinute * 60;
const msInDay = msInHour * 24;
const msInMonth = msInDay * 30;
const msInYear = msInMonth * 12;

export function decodeEntities(str: string) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = str;
  return textarea.value;
}

export function formatDistanceToNow(date: Date | number) {
  const distance = Math.abs(Date.now() - Number(date));
  if (distance < msInMinute) return `${Math.floor(distance / msInSecond)}s`;
  if (distance < msInHour) return `${Math.floor(distance / msInMinute)}m`;
  if (distance < msInDay) return `${Math.floor(distance / msInHour)}h`;
  if (distance < msInMonth) return `${Math.floor(distance / msInDay)}d`;
  if (distance < msInYear) return `${Math.floor(distance / msInMonth)}mo`;
  return `${Math.floor(distance / msInYear)}y`;
}

export function formatDate(date: Date | number) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function compactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
  }).format(value);
}

export function getCommentChildIds(
  comments: Record<string, Comment>,
  commentId: string,
) {
  return Object.values(comments)
    .filter((comment) => comment.parentId == commentId)
    .map((comment) => comment.id);
}

export function updateComment(
  comments: Record<string, Comment>,
  commentId: string,
  updater: (comment: Comment) => Partial<Comment>,
) {
  const comment = comments[commentId];
  const newComment = { ...comment, ...updater(comment) };
  const newComments = { ...comments, [commentId]: newComment };
  return newComments;
}

export function getIdType(id: string): IdType {
  const prefix = id.split("_")[0] as IdPrefix;
  return idTypes[prefix];
}

export function createId(string: string, type: IdType) {
  return `${idPrefixes[type]}_${string}`;
}

export function getSubmissionAuthorIds(
  submissions: Submission[],
  postAuthorType: AuthorType = "subreddit",
) {
  const ids = new Set<string>;

  for (const submission of submissions) {
    const isPost = "title" in submission;
    const isSubredditId = isPost && postAuthorType == "subreddit";
    const id = isSubredditId ? submission.subredditId : submission.userId;
    if (!id || ids.has(id)) continue;
    ids.add(id);
  }

  return [...ids];
}
