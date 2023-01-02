import {
  CommentThread,
  CommentThreadList,
} from "@types";

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

export function updateThread(
  threadList: CommentThreadList,
  path: string[],
  updater: (thread: CommentThread) => Partial<CommentThread>,
) {
  const threads = [...threadList.threads];
  const commentId = path[0];
  const threadIndex = threads
    .findIndex(({ comment }) => comment.id == commentId);
  const thread = { ...threads[threadIndex] };

  if (path.length == 1) {
    Object.assign(thread, updater(thread));
  } else {
    thread.replies = updateThread(thread.replies, path.slice(1), updater);
  }

  threads[threadIndex] = thread;
  threadList = { ...threadList, threads };

  return threadList;
}

export function traverseThreads(
  threadList: CommentThreadList,
  iteratee: (thread: CommentThread) => void,
) {
  for (const thread of threadList.threads) {
    iteratee(thread);
    traverseThreads(thread.replies, iteratee);
  }
}
