import { InfiniteData } from "@tanstack/react-query";
import { produce } from "immer";
import { getSubmissionAuthorIds } from "@utils";
import { queryClient } from "@services/query-client";
import { client } from "./client";
import {
  CommentThreadList,
  Submission,
  Post,
  Comment,
  Subreddit,
} from "@types";
import * as Raw from "./types";

export function isLinkPost(rawPost: Raw.Post): rawPost is Raw.LinkPost {
  return (
    "url_overridden_by_dest" in rawPost.data &&
    !!rawPost.data.url_overridden_by_dest
  );
}

export function isTextPost(rawPost: Raw.Post): rawPost is Raw.TextPost {
  return typeof rawPost.data.selftext_html == "string";
}

export function isGalleryPost(rawPost: Raw.Post): rawPost is Raw.GalleryPost {
  return "gallery_data" in rawPost.data && rawPost.data.gallery_data != null;
}

export function isVideoPost(rawPost: Raw.Post): rawPost is Raw.VideoPost {
  return (
    rawPost.data.is_video === true &&
    !!rawPost.data.media &&
    "reddit_video" in rawPost.data.media
  );
}

export function isExternalVideoPost(
  rawPost: Raw.Post,
): rawPost is Raw.ExternalVideoPost {
  return (
    "preview" in rawPost.data &&
    "reddit_video_preview" in <object>rawPost.data.preview
  );
}

export function isImagePost(rawPost: Raw.Post): rawPost is Raw.ImagePost {
  return "post_hint" in rawPost.data && rawPost.data.post_hint === "image";
}

export function isGIFPost(rawPost: Raw.Post): rawPost is Raw.GIFPost {
  return (
    "post_hint" in rawPost.data &&
    rawPost.data.post_hint == "image" &&
    "preview" in rawPost.data &&
    "variants" in rawPost.data.preview.images[0] &&
    "mp4" in rawPost.data.preview.images[0].variants
  );
}

export function isYouTubePost(rawPost: Raw.Post): rawPost is Raw.YouTubePost {
  const { media } = rawPost.data;
  return (
    !!media &&
    "type" in media &&
    media.type == "youtube.com" &&
    /\/embed\/([\w-]+)/.test(media?.oembed?.html)
  );
}

export function isCrossPost(rawPost: Raw.Post): rawPost is Raw.CrossPost {
  return (
    "crosspost_parent_list" in rawPost.data &&
    rawPost.data.crosspost_parent_list.length > 0
  );
}

export function isRemovedPost(rawPost: Raw.Post): rawPost is Raw.RemovedPost {
  return typeof rawPost.data.removed_by_category == "string";
}

export function isCommentDeleted(rawComment: Raw.Comment) {
  const { author, body } = rawComment.data;
  if (author != "[deleted]") return false;
  return body == "[deleted]" || body == "[removed]";
}

export function isRedditError(value: unknown): value is Raw.RedditError {
  return (
    value != null &&
    typeof value == "object" &&
    "error" in value &&
    "message" in value &&
    "reason" in value
  );
}

export function getCommentDeleter(rawComment: Raw.Comment) {
  const { body } = rawComment.data;
  if (!isCommentDeleted(rawComment)) return;
  if (body == "[deleted]") return "user";
  if (body == "[removed]") return "moderator";
}

export function getIdSuffix(id: string) {
  return id.split("_").at(-1) as string;
}

export function updatePostInCache(
  postId: string,
  updater: (draft: Post) => void,
  { active }: { active?: boolean } = {},
) {
  queryClient.setQueriesData<Post>(
    {
      type: active ? "active" : "all",
      queryKey: ["post", postId],
    },
    (post) => post && produce(post, updater),
  );

  queryClient.setQueriesData<InfiniteData<Post[]>>(
    {
      type: active ? "active" : "all",
      queryKey: ["post-feed"],
    },
    (data) =>
      data &&
      produce(data, (draft) => {
        for (const posts of draft.pages) {
          for (const post of posts) {
            if (post.id == postId) {
              Object.assign(post, updater(post));
              return;
            }
          }
        }
      }),
  );
}

export function updateCommentInCache(
  commentId: string,
  updater: (draft: Comment) => void,
  { active }: { active?: boolean } = {},
) {
  queryClient.setQueriesData<Comment>(
    {
      type: active ? "active" : "all",
      queryKey: ["comments", "detail", commentId],
    },
    (comment) => comment && produce(comment, updater),
  );

  queryClient.setQueriesData<CommentThreadList>(
    {
      type: active ? "active" : "all",
      queryKey: ["post-comments"],
    },
    (threadList) =>
      threadList &&
      produce(threadList, (threadListDraft) => {
        const comment = threadListDraft.comments[commentId];
        if (comment) Object.assign(comment, updater(comment));
      }),
  );

  queryClient.setQueriesData<InfiniteData<Comment[]>>(
    {
      type: active ? "active" : "all",
      queryKey: ["comment-feed"],
    },
    (data) =>
      data &&
      produce(data, (draft) => {
        for (const comments of draft.pages) {
          for (const comment of comments) {
            if (comment.id == commentId) {
              Object.assign(comment, updater(comment));
              return;
            }
          }
        }
      }),
  );
}

export function updatePostCommentsInCache(
  postId: string,
  updater: (draft: CommentThreadList) => void,
  { active }: { active?: boolean } = {},
) {
  queryClient.setQueriesData<CommentThreadList>(
    {
      type: active ? "active" : "all",
      queryKey: ["post-comments", postId],
    },
    (threadList) => threadList && produce(threadList, updater),
  );
}

export function addCommentsToCache(
  threadList: CommentThreadList,
  postId: string,
  commentId?: string,
) {
  updatePostCommentsInCache(
    postId,
    (threadListDraft) => {
      Object.assign(threadListDraft.comments, threadList.comments);
      if (!commentId) {
        threadListDraft.rootCommentIds.push(...threadList.rootCommentIds);
        threadListDraft.moreComments = threadList.moreComments;
      }
    },
    { active: true },
  );

  if (commentId) {
    updateCommentInCache(
      commentId,
      (comment) => {
        comment.childIds.push(...threadList.rootCommentIds);
        comment.moreChildren = threadList.moreComments;
      },
      { active: true },
    );
  }
}

export function addCommentToCache(comment: Comment) {
  const { id, parentId, postId } = comment;
  const isRootComment = postId == parentId;

  updatePostCommentsInCache(
    postId,
    (threadList) => {
      threadList.comments[id] = comment;
      if (isRootComment) threadList.rootCommentIds.unshift(id);
    },
    { active: true },
  );

  if (!isRootComment) {
    updateCommentInCache(
      parentId,
      (comment) => {
        comment.childIds.unshift(id);
      },
      { active: true },
    );
  }
}

export function deleteCommentFromCache(
  commentId: string,
  { active }: { active?: boolean } = {},
) {
  updateCommentInCache(commentId, (comment) => {
    comment.deletedBy = "user";
  });

  queryClient.setQueriesData<InfiniteData<Comment[]>>(
    {
      type: active ? "active" : "all",
      queryKey: ["comment-feed"],
    },
    (data) =>
      data &&
      produce(data, (draft) => {
        for (const comments of draft.pages) {
          const foundIndex = comments.findIndex((v) => v.id == commentId);
          if (foundIndex != -1) {
            comments.splice(foundIndex, 1);
            break;
          }
        }
      }),
  );
}

export function prefetchAvatars(submissions: Submission[]) {
  const authorIds = getSubmissionAuthorIds(submissions);
  const newAuthorIds = authorIds.filter(
    (id) => !queryClient.getQueryData(["avatars", "detail", id]),
  );
  const newAvatarsPromise = client.getAvatars(newAuthorIds);

  for (const newAuthorId of newAuthorIds) {
    queryClient.prefetchQuery({
      queryFn: async () => {
        const newAvatars = await newAvatarsPromise;
        return newAvatars[newAuthorId] || null;
      },
      queryKey: ["avatars", "detail", newAuthorId],
      cacheTime: Infinity,
    });
  }
}

export function updateSubredditInCache(
  subredditName: string,
  updater: (draft: Subreddit) => void,
) {
  queryClient.setQueryData<Subreddit>(
    ["subreddit", subredditName],
    (subreddit) => subreddit && produce(subreddit, updater),
  );
}

export function getFlairText({
  richText,
  text,
}: {
  richText?: Raw.FlairElement[];
  text?: string;
}) {
  if (richText?.length) {
    // Even if the result of the next return is an empty string, that's fine,
    // and we don't need to inspect the `text` variable. This is because a flair
    // may only consist of custom Reddit emojis. In this case `text` would
    // contain something like `":smiley:"` and it would be inappropriate output.
    return richText
      .filter((elem): elem is Raw.FlairTextElement => elem.e == "text")
      .map((elem) => elem.t)
      .join(" ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }
  if (text != null) return text;
}
