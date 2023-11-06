import {
  useState,
  useCallback,
  useEffect,
  RefObject,
  useRef,
  useMemo,
  useLayoutEffect,
} from "react";
import {
  generatePath,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import { isCommentSortingOption } from "@types";
import { createId } from "@utils";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
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

export function useSearchParams<T extends Record<string, string>>(): [
  T,
  (params: T) => void,
] {
  const history = useHistory();
  const { search } = useLocation();

  const params = Object.fromEntries(new URLSearchParams(search)) as T;
  const setParams = (params: T) => {
    history.replace({ search: String(new URLSearchParams(params)) });
  };

  return [params, setParams];
}

export function usePostParams() {
  const [params] = useParams<{ id: string }>();
  const [searchParams] = useSearchParams<{
    comments?: string;
    sort?: string;
  }>();

  const postId = createId(params.id, "post");
  const commentSorting = isCommentSortingOption(searchParams.sort)
    ? searchParams.sort
    : undefined;
  const shouldScrollToComments = searchParams.comments != null;

  return { postId, commentSorting, shouldScrollToComments };
}

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

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
  const [loaded, setLoaded] = useState(false);
  const img = useMemo(() => {
    if (!src) return;
    const img = document.createElement("img");
    img.src = src;
    if (!img.complete) img.onload = () => setLoaded(true);
    return img;
  }, [src]);

  if (img && loaded != img.complete) setLoaded(img.complete);

  return loaded;
}

export function useTextAreaAutoHeight(
  ref: React.RefObject<HTMLTextAreaElement>,
) {
  const [height, setHeight] = useState<number>();

  useLayoutEffect(() => {
    const textArea = ref.current;
    if (!textArea) return;

    const { height: origHeight, overflow: origOverflow } = textArea.style;
    const borderSize = textArea.offsetHeight - textArea.clientHeight;

    textArea.style.height = "";
    textArea.style.overflow = "hidden";
    // Need to add `1`, because some browsers do not correctly calculate the
    // height of the element if the page is scaled
    setHeight(textArea.scrollHeight + borderSize + 1);
    textArea.style.height = origHeight;
    textArea.style.overflow = origOverflow;
  }, [ref.current?.value]);

  return height;
}

export function useParams<T extends Record<string, string>>(): [
  T,
  (params: T) => void,
] {
  const match = useRouteMatch<T>();
  const history = useHistory();

  const setParams = useCallback(
    (params: T) => {
      const pathname = generatePath(match.path, params);
      history.replace({ pathname });
    },
    [match, history],
  );

  return [match.params, setParams];
}

const initialPathname = location.pathname;
let spaNavigationOcurred = false;

export function useNavigationType() {
  const { action, location } = useHistory();
  const { navigation } = performance;

  if (location.pathname != initialPathname) spaNavigationOcurred = true;

  if (spaNavigationOcurred) {
    switch (action) {
      case "POP":
        return "BACK_FORWARD";
      case "PUSH":
        return "NAVIGATE";
      default:
        return action;
    }
  }

  switch (navigation.type) {
    case navigation.TYPE_RELOAD:
      return "RELOAD";
    case navigation.TYPE_BACK_FORWARD:
      return "BACK_FORWARD";
    default:
      return "NAVIGATE";
  }
}
