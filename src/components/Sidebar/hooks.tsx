import { useSubreddits, useMySubscriptions } from "@services/api";
import { useAuth } from "@services/auth";
import { defaultSubredditIds } from "./data";

export function useSidebarSubreddits() {
  const { authorized } = useAuth();

  const defaultSubredditsQueryResult = useSubreddits(defaultSubredditIds, {
    enabled: !authorized,
  });
  const mySubredditsQueryResult = useMySubscriptions({ enabled: authorized });

  return authorized ? mySubredditsQueryResult : defaultSubredditsQueryResult;
}
