import {
  useState,
  useCallback,
  useEffect,
  RefObject,
  useRef,
  useLayoutEffect,
} from "react";
import {
  generatePath,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import { MediaPlaybackStatus, isCommentSortingOption } from "@types";
import { createId, createImage } from "@utils";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { useAuth } from "@services/auth";
import toast from "react-hot-toast";
import {
  addOnScreenMediaId,
  removeOnScreenMediaId,
} from "@store/onScreenMediaIdsSlice";

const NAVBAR_HEIGHT = "50px";

export function useClickOutside(
  ref: RefObject<Element>,
  callback: () => void,
): void;

export function useClickOutside(
  refs: RefObject<Element>[],
  callback: () => void,
): void;

export function useClickOutside(
  arg: RefObject<Element> | RefObject<Element>[],
  callback: () => void,
): void {
  const handleClick = useEvent(({ target }: MouseEvent) => {
    if (!(target instanceof Element)) return;
    const refs = Array.isArray(arg) ? arg : [arg];
    if (refs.some((ref) => ref.current?.contains(target))) return;
    callback();
  });

  useEffect(() => {
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [handleClick]);
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
  const [params] = useParams<{ commentId?: string; id: string }>();
  const [searchParams] = useSearchParams<{
    comments?: string;
    sort?: string;
  }>();

  const commentId = params.commentId && createId(params.commentId, "comment");
  const postId = createId(params.id, "post");
  const commentSorting = isCommentSortingOption(searchParams.sort)
    ? searchParams.sort
    : undefined;
  const shouldScrollToComments =
    searchParams.comments != null || !!params.commentId;

  return {
    postId,
    commentId,
    commentSorting,
    shouldScrollToComments,
  };
}

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useAuthGuard<T extends unknown[], R>(func?: (...args: T) => R) {
  const { authorized } = useAuth();

  return useCallback(
    (...args: T) => {
      if (authorized) return func?.(...args);
      toast.error("Sign in to perform this action");
    },
    [authorized, func],
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
): [T | undefined, (value: T) => void, () => void] {
  const latestInitialValue = useRef(initialValue);
  useEffect(() => {
    latestInitialValue.current = initialValue;
  });

  const getStoredValue = useCallback(() => {
    const item = localStorage.getItem(key);
    if (item != null) return JSON.parse(item) as T;
  }, [key]);

  const [value, setValue] = useState(() => {
    const storedValue = getStoredValue();
    return storedValue !== undefined ? storedValue : initialValue;
  });

  const storeValue = useCallback(
    (newValue: T) => {
      localStorage.setItem(key, JSON.stringify(newValue));
      setValue(newValue);
    },
    [key],
  );

  const deleteValue = useCallback(() => {
    localStorage.removeItem(key);
    setValue(undefined);
  }, [key]);

  useEffect(() => {
    const storedValue = getStoredValue();
    if (storedValue === undefined && latestInitialValue.current !== undefined) {
      storeValue(latestInitialValue.current);
    } else {
      setValue(storedValue);
    }
  }, [getStoredValue, key, storeValue]);

  return [value, storeValue, deleteValue];
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => matchMedia(query).matches);

  useEffect(() => {
    const queryList = matchMedia(query);
    const updateMatches = () => setMatches(queryList.matches);
    updateMatches();
    queryList.addEventListener("change", updateMatches);
    return () => queryList.removeEventListener("change", updateMatches);
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

export function useIsImageLoading(src = "") {
  const [isLoading, setIsLoading] = useState(
    () => !createImage({ src }).complete,
  );

  useEffect(() => {
    const image = createImage({ src });
    const updateIsLoading = () => setIsLoading(!image.complete);
    updateIsLoading();
    if (!image.complete) {
      image.addEventListener("load", updateIsLoading);
      return () => image.removeEventListener("load", updateIsLoading);
    }
  }, [src]);

  return isLoading;
}

export function useTextAreaAutoHeight(
  ref: React.RefObject<HTMLTextAreaElement>,
  value?: string,
) {
  const [height, setHeight] = useState<number>();

  useLayoutEffect(() => {
    const elem = ref.current;
    if (!elem) return;

    const { clientHeight, offsetHeight, style } = elem;
    const { height: origHeight, overflowY: origOverflowY } = style;
    const borderSize = offsetHeight - clientHeight;

    style.height = "";
    style.overflowY = "hidden";
    setHeight(elem.scrollHeight + borderSize);
    style.height = origHeight;
    style.overflowY = origOverflowY;
  }, [ref, value]);

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

const initialLocationKey: string | undefined = history.state?.key;
let spaNavigationOcurred = false;

export function useNavigationType() {
  const { action, location } = useHistory();
  const { navigation } = performance;

  if (location.key != initialLocationKey) spaNavigationOcurred = true;

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

export function useIntersectionDetector<T extends Element>({
  delay = 0,
  ref,
  rootMargin,
  threshold,
  onEnter,
  onLeave,
}: {
  delay?: number;
  ref: React.RefObject<T>;
  rootMargin?: string;
  threshold?: number;
  onEnter?: () => void;
  onLeave?: () => void;
}) {
  const callbacksRef = useRef({ onEnter, onLeave });
  const [intersecting, setIntersecting] = useState(false);
  const shouldHandleLeaveRef = useRef(false);
  const timerRef = useRef<number>();

  useEffect(() => {
    callbacksRef.current = { onEnter, onLeave };
  }, [onEnter, onLeave]);

  useEffect(() => {
    if (!ref.current) return;

    const handleEnter = () => {
      callbacksRef.current.onEnter?.();
      shouldHandleLeaveRef.current = true;
      setIntersecting(true);
    };

    const handleLeave = () => {
      if (!shouldHandleLeaveRef.current) return;
      callbacksRef.current.onLeave?.();
      shouldHandleLeaveRef.current = false;
      setIntersecting(false);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (delay == 0) {
            entry.isIntersecting ? handleEnter() : handleLeave();
          } else if (entry.isIntersecting) {
            timerRef.current = setTimeout(handleEnter, delay);
          } else {
            clearTimeout(timerRef.current);
            handleLeave();
          }
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      handleLeave();
    };
  }, []);

  return intersecting;
}

export function usePageIntersectionDetector<T extends Element>(
  options: Parameters<typeof useIntersectionDetector<T>>[0],
) {
  return useIntersectionDetector({
    delay: 200,
    rootMargin: `-${NAVBAR_HEIGHT} 0px 0px`,
    ...options,
  });
}

export function useLastOnScreenMedia<T extends Element>(
  ref: React.RefObject<T>,
  key: string,
) {
  const dispatch = useAppDispatch();
  const isLastOnScreen = useAppSelector(
    (state) => state.onScreenMediaIds.at(-1) == key,
  );

  usePageIntersectionDetector({
    ref,
    threshold: 0.75,
    onEnter: () => dispatch(addOnScreenMediaId(key)),
    onLeave: () => dispatch(removeOnScreenMediaId(key)),
  });

  return isLastOnScreen;
}

export function useIsSmallScreen() {
  return useMediaQuery("(max-width: 576px)");
}

export function useIsLargeScreen() {
  return useMediaQuery("(min-width: 992px)");
}

export function useTransitionState({
  duration,
  in: inProp = false,
}: {
  duration: number | { enter?: number; exit?: number };
  in?: boolean;
}) {
  const [status, setStatus] = useState<
    "enter" | "entering" | "exit" | "exiting"
  >(inProp ? "enter" : "exit");
  const [shouldMount, setShouldMount] = useState(inProp);
  const isActive = status == "entering" || status == "exiting";

  useLayoutEffect(() => {
    if (inProp) {
      if (status == "exit") {
        if (!shouldMount) {
          // The target component is ready to change its status from `exit` to
          // `entering`. Make sure that the component is mounted.
          setShouldMount(true);
        } else {
          // The target component should now be mounted. To make the transition
          // happen, it is necessary to paint the component first.
          let ignore = false;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (!ignore) setStatus("entering");
            });
          });
          return () => (ignore = true);
        }
      } else if (status == "exiting") {
        setStatus("entering");
      }
    } else {
      if (status == "enter" || status == "entering") {
        setStatus("exiting");
      } else if (status == "exit" && shouldMount) {
        setShouldMount(false);
      }
    }

    // Change `status` from `entering` to `enter` and from `exiting` to `exit`
    // automatically with a delay
    if (status == "entering" || status == "exiting") {
      const nextStatus = status == "entering" ? "enter" : "exit";
      const delay =
        typeof duration == "number" ? duration : duration[nextStatus];
      const timeout = setTimeout(() => setStatus(nextStatus), delay);
      return () => clearTimeout(timeout);
    }
  }, [inProp, shouldMount, status]);

  return { isActive, shouldMount, status };
}

export function useMediaPlayback<T extends Element>(
  ref: React.RefObject<T>,
  key: string,
) {
  const isLastOnScreen = useLastOnScreenMedia(ref, key);
  const isNearViewport = usePageIntersectionDetector({
    ref,
    rootMargin: "100% 0px",
  });

  let status: MediaPlaybackStatus;

  if (isLastOnScreen) {
    status = "playing";
  } else if (isNearViewport) {
    status = "paused";
  } else {
    status = "stopped";
  }

  return { status };
}

export function useEvent<T extends unknown[], R>(callback: (...args: T) => R) {
  const ref = useRef(callback);
  useLayoutEffect(() => {
    ref.current = callback;
  });
  return useCallback((...args: T) => ref.current(...args), []);
}

// A hook that simplifies the creation of components that can be either
// controlled or uncontrolled
export function useControllableState<T>(
  value: T,
  defaultValue: T | (() => T),
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const isControlled = value !== undefined;
  const innerState = useState(defaultValue);
  const noop = useCallback(() => {}, []);
  return isControlled ? [value, noop] : innerState;
}
