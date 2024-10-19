import React from "react";
import { capitalize } from "lodash-es";
import {
  FeedSortingOption,
  SortTimeInterval,
  isSortRequiresTimeInterval,
} from "@types";

import { Select } from "../Select/Select";
import "./Feed.scss";

type FeedProps<T> = {
  sort: T;
  sortingOptions: readonly T[];
  sortTimeInterval?: SortTimeInterval;
  onSortChange?: (v: T) => void;
  onSortTimeIntervalChange?: (v: SortTimeInterval) => void;
  children: React.ReactNode;
};

export function Feed<T extends FeedSortingOption>({
  sort,
  sortingOptions,
  sortTimeInterval = "day",
  onSortChange,
  onSortTimeIntervalChange,
  children,
}: FeedProps<T>) {
  return (
    <div className="feed">
      <div className="feed__sort">
        <Select
          color="clear"
          options={sortingOptions.map((sortingOption) => ({
            value: sortingOption,
            label: capitalize(sortingOption),
          }))}
          pill
          value={sort}
          onSelect={(value) => onSortChange?.(value)}
        />
        {isSortRequiresTimeInterval(sort) && (
          <Select
            color="clear"
            options={[
              { value: "hour", label: "Hour" },
              { value: "day", label: "Day" },
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
              { value: "year", label: "Year" },
              { value: "all", label: "All Time" },
            ]}
            pill
            value={sortTimeInterval}
            onSelect={(value) => onSortTimeIntervalChange?.(value)}
          />
        )}
      </div>
      {children}
    </div>
  );
}
