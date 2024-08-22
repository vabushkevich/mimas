import {
  useState,
  useCallback,
  useEffect,
  RefObject,
  useRef,
  useLayoutEffect,
  useReducer,
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
  initialCount = 0,
  isLooped,
  min = -Infinity,
  max = Infinity,
}: {
  initialCount?: number;
  isLooped?: boolean;
  min?: number;
  max?: number;
}) {
  type Action =
    | { type: "increment" }
    | { type: "decrement" }
    | { type: "reset" }
    | { type: "set"; value: number };

  const clamp = (value: number) => Math.min(Math.max(min, value), max);

  const [count, dispatch] = useReducer((state: number, action: Action) => {
    switch (action.type) {
      case "increment":
        if (state < max) return state + 1;
        return isLooped ? min : state;
      case "decrement":
        if (state > min) return state - 1;
        return isLooped ? max : state;
      case "reset":
        return clamp(initialCount);
      case "set":
        return clamp(action.value);
    }
  }, clamp(initialCount));

  const increment = useCallback(() => dispatch({ type: "increment" }), []);
  const decrement = useCallback(() => dispatch({ type: "decrement" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const set = useCallback(
    (value: number) => dispatch({ type: "set", value }),
    [],
  );

  return { count, increment, decrement, reset, set };
}

export function usePagination({
  initialPage,
  isLooped,
  pageCount,
}: {
  initialPage?: number;
  isLooped?: boolean;
  pageCount: number;
}) {
  const firstPage = 0;
  const lastPage = pageCount - 1;
  const {
    count: page,
    increment: nextPage,
    decrement: prevPage,
    set: setPage,
  } = useCounter({
    initialCount: initialPage,
    isLooped,
    min: firstPage,
    max: lastPage,
  });

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

export function useInView<T extends Element>(
  ref: React.RefObject<T>,
  {
    delay = 0,
    rootMargin,
    threshold,
  }: {
    delay?: number;
    rootMargin?: string;
    threshold?: number;
  },
) {
  const [isInView, setIsInView] = useState(false);

  const latestDelay = useRef(delay);
  useEffect(() => {
    latestDelay.current = delay;
  }, [delay]);

  useEffect(() => {
    if (!ref.current) return;

    let timeout: number | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const delay = latestDelay.current;
          const updateIsInView = () => setIsInView(entry.isIntersecting);
          if (delay == 0 || !entry.isIntersecting) {
            clearTimeout(timeout);
            updateIsInView();
          } else {
            timeout = setTimeout(updateIsInView, delay);
          }
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [ref, rootMargin, threshold]);

  return isInView;
}

export function useInPageView<T extends Element>(
  ...[ref, options]: Parameters<typeof useInView<T>>
) {
  return useInView(ref, {
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

  const isInPageView = useInPageView(ref, { threshold: 0.75 });
  useLayoutEffect(() => {
    if (isInPageView) dispatch(addOnScreenMediaId(key));
    return () => {
      if (isInPageView) dispatch(removeOnScreenMediaId(key));
    };
  }, [dispatch, isInPageView, key]);

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

  const latestDuration = useRef(duration);
  useEffect(() => {
    latestDuration.current = duration;
  }, [duration]);

  // Reacting to `in` argument changes
  const [prevInProp, setPrevInProp] = useState(inProp);
  if (inProp != prevInProp) {
    setPrevInProp(inProp);
    if (inProp) {
      if (status == "exit") {
        // The target component is about to change its status from `exit` to
        // `entering`. Before doing so, the component should be mounted.
        if (!shouldMount) setShouldMount(true);
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
  }

  // Change `status` from `exit` to `entering` after the component is painted
  useEffect(() => {
    if (status != "exit" || !shouldMount) return;
    // The target component should now be mounted and ready to change its
    // status from `exit` to `entering`. To make the transition happen, it is
    // necessary to paint the component first.
    let ignore = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!ignore) setStatus("entering");
      });
    });
    return () => {
      ignore = true;
    };
  }, [shouldMount, status]);

  // Change `status` from `entering` to `enter` and from `exiting` to `exit`
  // automatically with a delay
  useEffect(() => {
    if (status == "enter" || status == "exit") return;
    const nextStatus = status == "entering" ? "enter" : "exit";
    const duration = latestDuration.current;
    const delay = typeof duration == "number" ? duration : duration[nextStatus];
    const timeout = setTimeout(() => {
      if (nextStatus == "exit") setShouldMount(false);
      setStatus(nextStatus);
    }, delay);
    return () => clearTimeout(timeout);
  }, [status]);

  return { isActive, shouldMount, status };
}

export function useMediaPlayback<T extends Element>(
  ref: React.RefObject<T>,
  key: string,
) {
  const isLastOnScreen = useLastOnScreenMedia(ref, key);
  const isNearViewport = useInPageView(ref, { rootMargin: "100% 0px" });

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
