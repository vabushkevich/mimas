import { InfiniteData } from "react-query";
import produce from "immer";
import { getSubmissionAuthorIds } from "@utils";
import { queryClient } from "@services/query-client";
import { client } from "./client";
import {
  CommentThreadList,
  Submission,
  Post,
  Comment,
} from "@types";
import * as Raw from "./types";

export function isLinkPost(rawPost: Raw.Post): rawPost is Raw.LinkPost {
  if (!("url_overridden_by_dest" in rawPost.data)) return false;
  const { url_overridden_by_dest } = rawPost.data;
  switch (new URL(url_overridden_by_dest).hostname) {
    case "www.reddit.com":
    case "i.redd.it":
    case "v.redd.it":
      return false;
  }
  return true;
}

export function isTextPost(rawPost: Raw.Post): rawPost is Raw.TextPost {
  return typeof rawPost.data.selftext_html == "string";
}

export function isGalleryPost(rawPost: Raw.Post): rawPost is Raw.GalleryPost {
  return "gallery_data" in rawPost.data;
}

export function isVideoPost(rawPost: Raw.Post): rawPost is Raw.VideoPost {
  return rawPost.data.is_video === true;
}

export function isImagePost(rawPost: Raw.Post): rawPost is Raw.ImagePost {
  return (
    "post_hint" in rawPost.data
    && rawPost.data.post_hint === "image"
  );
}

export function isGIFPost(rawPost: Raw.Post): rawPost is Raw.GIFPost {
  return (
    "post_hint" in rawPost.data
    && rawPost.data.post_hint == "image"
    && "preview" in rawPost.data
    && "variants" in rawPost.data.preview.images[0]
    && "mp4" in rawPost.data.preview.images[0].variants
  );
}

export function isYouTubePost(rawPost: Raw.Post): rawPost is Raw.YouTubePost {
  const { media } = rawPost.data;
  return !!media && "type" in media && media.type == "youtube.com";
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
  return id.split("_").at(-1);
}

export function updatePostInCache({ id }: Post, updater: (v: Post) => Post) {
  queryClient.setQueriesData<Post>(
    ["post", id],
    (post) => updater(post),
  );

  queryClient.setQueriesData<InfiniteData<Post[]>>(
    {
      exact: false,
      queryKey: ["post-feed"],
    },
    (data) => produce(data, (draft) => {
      for (const posts of draft.pages) {
        for (const post of posts) {
          if (post.id == id) {
            Object.assign(post, updater(post));
            return;
          }
        }
      }
    }),
  );
}

export function updateCommentInCache(
  { id, postId }: Comment,
  updater: (v: Comment) => Comment,
) {
  queryClient.setQueriesData<Comment>(
    ["comments", "detail", id],
    (comment) => updater(comment),
  );

  queryClient.setQueriesData<CommentThreadList>(
    {
      exact: false,
      queryKey: ["post-comments", postId],
    },
    (data) => produce(data, (draft) => {
      const comment = draft.comments[id];
      if (comment) Object.assign(comment, updater(comment));
    }),
  );
}

export function addCommentToCache(comment: Comment) {
  const { id, parentId, postId } = comment;

  queryClient.setQueriesData<CommentThreadList>(
    {
      exact: false,
      queryKey: ["post-comments", postId],
    },
    (threadList) => produce(threadList, (draft) => {
      draft.comments[id] = comment;
      if (parentId == postId) draft.rootCommentIds.unshift(id);
    }),
  );

  if (parentId != postId) {
    const parentComment = queryClient.getQueryData<Comment>(
      ["comments", "detail", parentId]
    );
    updateCommentInCache(parentComment, (comment) => ({
      ...comment,
      childIds: [id, ...comment.childIds],
    }));
  }
}

export function prefetchAvatars(submissions: Submission[]) {
  const authorIds = getSubmissionAuthorIds(submissions);
  const newAuthorIds = authorIds.filter((id) =>
    !queryClient.getQueryData(["avatars", "detail", id])
  );
  const newAvatarsPromise = client.getAvatars(newAuthorIds);

  for (const authorId of authorIds) {
    queryClient.prefetchQuery({
      queryFn: async () => {
        const newAvatars = await newAvatarsPromise;
        return newAvatars[authorId];
      },
      queryKey: ["avatars", "detail", authorId],
      staleTime: Infinity,
    });
  }
}
