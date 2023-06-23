import { findLast } from "lodash-es";
import { Comment, IdPrefix, IdType, Submission, isIdPrefix } from "@types";

const idPrefixTypePairs: [IdPrefix, IdType][] = [
  ["t1", "comment"],
  ["t2", "user"],
  ["t3", "post"],
  ["t4", "message"],
  ["t5", "subreddit"],
  ["t6", "award"],
];

const idTypes = Object.fromEntries(idPrefixTypePairs) as Record<
  IdPrefix,
  IdType
>;

const idPrefixes = Object.fromEntries(
  idPrefixTypePairs.map(([prefix, type]) => [type, prefix]),
) as Record<IdType, IdPrefix>;

const msInSecond = 1000;
const msInMinute = msInSecond * 60;
const msInHour = msInMinute * 60;
const msInDay = msInHour * 24;
const msInMonth = msInDay * 30;
const msInYear = msInMonth * 12;

const durationUnits = [
  { name: "s", ms: msInSecond },
  { name: "m", ms: msInMinute },
  { name: "h", ms: msInHour },
  { name: "d", ms: msInDay },
  { name: "mo", ms: msInMonth },
  { name: "y", ms: msInYear },
];

export class HTTPError extends Error {
  response?: Response;

  constructor(message?: string, response?: Response) {
    super(message);
    this.response = response;
  }
}

export function formatDistanceToNow(date: Date | number) {
  const distance = Math.abs(Date.now() - Number(date));
  return formatDuration(distance);
}

function formatDuration(duration: number) {
  const unit =
    findLast(durationUnits, (unit) => unit.ms <= duration) || durationUnits[0];
  const value = Math.floor(duration / unit.ms);
  return `${value}${unit.name}`;
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
  const prefix = id.split("_")[0];
  assert(isIdPrefix(prefix), `Invalid id prefix. Got: "${prefix}".`);
  return idTypes[prefix];
}

export function createId(string: string, type: IdType) {
  return `${idPrefixes[type]}_${string}`;
}

export function getSubmissionAuthorIds(submissions: Submission[]) {
  const ids = new Set<string>();

  for (const submission of submissions) {
    const isPost = "title" in submission;
    if (isPost) ids.add(submission.subredditId);
    if (submission.userId) ids.add(submission.userId);
  }

  return [...ids];
}

export function assert(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

export function hashString(string: string) {
  return [...string].reduce((res, c) => res + c.charCodeAt(0), 0);
}

export function pseudoRandom(seed: number) {
  return (seed * 16807) % 2147483647;
}

// Creates a function that returns the pending promise obtained from the last
// func call. If there is no promise or it is settled, then the func is called.
export function debounceAsync<T extends unknown[], V>(
  this: unknown,
  func: (...args: T) => Promise<V>,
) {
  let promise: Promise<V> | null;

  return (...args: T) => {
    promise ??= func.apply(this, args).finally(() => {
      promise = null;
    });

    return promise;
  };
}
