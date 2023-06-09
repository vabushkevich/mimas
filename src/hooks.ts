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
import { TypedUseSelectorHook, useSelector } from "react-redux";
import type { RootState } from "./store";
import { useAuth } from "@services/auth";
import toast from "react-hot-toast";

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

export function useQueryString<
  T extends { [key: string]: string },
>(): Partial<T> {
  const { search } = useLocation();
  return useMemo(
    () => Object.fromEntries(new URLSearchParams(search)) as T,
    [search],
  );
}

export function usePostParams() {
  const params = useParams<{ id: string }>();
  const query = useQueryString<{ sort: string }>();

  const postId = createId(params.id, "post");
  const sort = isCommentSortingMethod(query.sort) ? query.sort : "confidence";

  return { postId, sort };
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useAuthGuard<F extends (...args: any[]) => any>(fn?: F): F {
  const { authorized } = useAuth();

  return useCallback(
    <F>((...args: any[]) => {
      if (authorized) return fn?.(...args);
      toast.error("Sign in to perform this action");
    }),
    [authorized, fn],
  );
}

export function useCounter({
  initialCount,
  min = -Infinity,
  max = Infinity,
}: {
  initialCount: number;
  min?: number;
  max?: number;
}) {
  const [count, setCount] = useState(initialCount);

  const decrement = () => {
    setCount(Math.max(min, count - 1));
  };

  const increment = () => {
    setCount(Math.min(count + 1, max));
  };

  const set = (value: number) => {
    setCount(Math.min(Math.max(min, value), max));
  };

  const reset = () => {
    setCount(initialCount);
  };

  return { count, decrement, increment, set, reset };
}

export function usePagination({
  initialPage,
  pageCount,
  infinite = false,
}: {
  initialPage: number;
  pageCount: number;
  infinite?: boolean;
}) {
  const firstPage = 0;
  const lastPage = pageCount - 1;
  const {
    count: page,
    decrement: decrementPage,
    increment: incrementPage,
    set: setPage,
  } = useCounter({
    initialCount: initialPage,
    min: firstPage,
    max: lastPage,
  });

  const prevPage = () => {
    if (infinite && page <= firstPage) {
      setPage(lastPage);
    } else {
      decrementPage();
    }
  };

  const nextPage = () => {
    if (infinite && page >= lastPage) {
      setPage(firstPage);
    } else {
      incrementPage();
    }
  };

  return { page, prevPage, nextPage, setPage };
}

export function useLocalStorage<T>(
  key: string,
  initialValue?: T,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(
    JSON.parse(String(localStorage.getItem(key))) ?? initialValue,
  );

  // If the `setStorageValue()` function is called after the component has been
  // unmounted, `setValue(newValue)` will have no effect and the state will be
  // lost. To prevent this, it is necessary to store the value in the local
  // storage first.
  const setStorageValue = (newValue: T) => {
    localStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  };

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key]);

  return [value, setStorageValue];
}

export function useMediaQuery(query: string) {
  const queryList = matchMedia(query);
  const [matches, setMatches] = useState(queryList.matches);

  useEffect(() => {
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    queryList.addEventListener("change", handleChange);

    return () => queryList.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

export function useTitle(title?: string) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title != null) document.title = title;
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}

export function usePreloadImage(src?: string) {
  const img = useMemo(() => {
    const img = document.createElement("img");
    if (src) img.src = src;
    return img;
  }, [src]);
  const [loaded, setLoaded] = useState(img.complete);

  if (loaded != img.complete) setLoaded(img.complete);

  useEffect(() => {
    if (!img.complete) img.onload = () => setLoaded(true);
  }, [img]);

  return loaded;
}
