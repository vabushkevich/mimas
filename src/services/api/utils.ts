import { InfiniteData } from "@tanstack/react-query";
import produce from "immer";
import { getSubmissionAuthorIds } from "@utils";
import { queryClient } from "@services/query-client";
import { client } from "./client";
import { WritableDraft } from "immer/dist/internal";
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
  return "gallery_data" in rawPost.data;
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
  updater: (draft: WritableDraft<Post>) => void,
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
  postId: string,
  commentId: string,
  updater: (draft: WritableDraft<Comment>) => void,
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
      queryKey: ["post-comments", postId],
    },
    (threadList) =>
      threadList &&
      produce(threadList, (threadListDraft) => {
        const comment = threadListDraft.comments[commentId];
        if (comment) Object.assign(comment, updater(comment));
      }),
  );
}

export function updatePostCommentsInCache(
  postId: string,
  updater: (draft: WritableDraft<CommentThreadList>) => void,
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
    },
    { active: true },
  );

  if (commentId) {
    updateCommentInCache(
      postId,
      commentId,
      (comment) => {
        comment.childIds.push(...threadList.rootCommentIds);
        comment.moreChildren = threadList.moreComments;
      },
      { active: true },
    );
  } else {
    updatePostCommentsInCache(
      postId,
      (threadListDraft) => {
        threadListDraft.rootCommentIds.push(...threadList.rootCommentIds);
        threadListDraft.moreComments = threadList.moreComments;
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
    },
    { active: true },
  );

  if (isRootComment) {
    updatePostCommentsInCache(
      postId,
      (threadList) => {
        threadList.rootCommentIds.unshift(id);
      },
      { active: true },
    );
  } else {
    updateCommentInCache(
      postId,
      parentId,
      (comment) => {
        comment.childIds.unshift(id);
      },
      { active: true },
    );
  }
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
        return newAvatars[newAuthorId];
      },
      queryKey: ["avatars", "detail", newAuthorId],
      cacheTime: Infinity,
    });
  }
}

export function updateSubredditInCache(
  subredditName: string,
  updater: (draft: WritableDraft<Subreddit>) => void,
) {
  queryClient.setQueryData<Subreddit>(
    ["subreddit", subredditName],
    (subreddit) => subreddit && produce(subreddit, updater),
  );
}
