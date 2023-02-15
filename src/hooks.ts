import {
  useState,
  useCallback,
  useEffect,
  RefObject,
  useRef,
  useMemo,
} from "react";
import { useLocation, useParams } from "react-router-dom";
import { isCommentSortingMethod } from "@types";
import { createId } from "@utils";

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
