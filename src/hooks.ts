import {
  useState,
  useCallback,
  useEffect,
  RefObject,
  useRef,
  useContext,
  useMemo,
} from "react";
import { useLocation, useParams } from "react-router-dom";
import { groupBy } from "lodash-es";
import { ClientContext } from "@context";
import { AuthorType, Submission, isCommentSortingMethod } from "@types";
import { getIdType, getSubmissionAuthorIds, createId } from "@utils";

export function useToggleArrayValue<T = any>(): [T[], (value: T) => void] {
  const [array, setArray] = useState<T[]>([]);

  const toggleValue = useCallback((value: T) => {
    setArray((array) => {
      const newArray = array.slice();
      const valueIndex = array.indexOf(value);
      if (valueIndex == -1) {
        newArray.push(value);
      } else {
        newArray.splice(valueIndex, 1);
      }
      return newArray;
    });
  }, []);

  return [array, toggleValue];
}

export function useClickOutside(
  ref: RefObject<HTMLElement>,
  callback: () => void,
): void;

export function useClickOutside(
  refs: RefObject<HTMLElement>[],
  callback: () => void,
): void;

export function useClickOutside(
  arg: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  callback: () => void,
): void {
  const refs = Array.isArray(arg) ? arg : [arg];
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleClick = ({ target }: MouseEvent) => {
      const elems = refs.map((ref) => ref.current);
      if (elems.some((elem) => !elem || elem.contains(target as Node))) return;
      callbackRef.current();
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, refs);
}

export function useNewValues<T>(array: T[]) {
  const ref = useRef<Set<T>>(new Set());
  const prevValues = ref.current;
  const newValues = [];

  for (const v of array) {
    if (prevValues.has(v)) continue;
    newValues.push(v);
    prevValues.add(v);
  }

  return newValues;
}

export function useAvatars(
  submissions: Submission[],
  postAuthorType: AuthorType = "subreddit",
) {
  const client = useContext(ClientContext);
  const [avatars, setAvatars] = useState<Record<string, string>>({});
  const authorIds = getSubmissionAuthorIds(submissions, postAuthorType);
  const newAuthorIds = useNewValues(authorIds);

  useEffect(() => {
    (async () => {
      if (newAuthorIds.length == 0) return;

      const {
        user: userIds = [],
        subreddit: subredditIds = [],
      } = groupBy(newAuthorIds, getIdType);

      const authors = [
        ...await client.getUsers(userIds),
        ...await client.getSubreddits(subredditIds),
      ];

      const newAvatars = authors.reduce(
        (res, author) => (res[author.id] = author.avatar, res),
        {} as Record<string, string>,
      );

      setAvatars((avatars) => ({ ...avatars, ...newAvatars }));
    })();
  }, [newAuthorIds]);

  return avatars;
}

export function useQuery<T extends { [key: string]: string }>(): T {
  const { search } = useLocation();
  return useMemo(
    () => Object.fromEntries(new URLSearchParams(search)) as T,
    [search],
  );
}

export function usePostParams() {
  const params = useParams<{ id: string }>();
  const query = useQuery<{ sort: string }>();

  const postId = createId(params.id, "post");
  const sort = isCommentSortingMethod(query.sort) ? query.sort : "confidence";

  return { postId, sort };
}
