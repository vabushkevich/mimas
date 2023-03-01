import { useSubreddits, useMySubscriptions } from "@services/api";
import { useAuth } from "@services/auth";

const subredditIds = ["t5_2qh33", "t5_2qh1i", "t5_2qh1o", "t5_2qh1u", "t5_2qqjc", "t5_2qh3s", "t5_mouw", "t5_2szyo", "t5_2qh1e", "t5_2qjpg", "t5_2sbq3", "t5_2qh87", "t5_2qh7a", "t5_2ti4h", "t5_2qt55", "t5_2qgzt", "t5_2tk95", "t5_3gdh7", "t5_2x93b", "t5_m0bnr"];

export function useSidebarSubreddits() {
  const { authorized } = useAuth();

  const publicSubredditsQueryResult = useSubreddits(subredditIds, {
    enabled: !authorized,
  });
  const mySubredditsQueryResult = useMySubscriptions({ enabled: authorized });

  return authorized ? mySubredditsQueryResult : publicSubredditsQueryResult;
};
