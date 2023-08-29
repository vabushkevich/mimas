import React from "react";
import { capitalize } from "lodash-es";
import {
  PostSortingOption,
  SortTimeInterval,
  isSortRequiresTimeInterval,
  isPostSortingOption,
  isSortTimeInterval,
} from "@types";

import { DropdownMenu, MenuItem, DropdownButton } from "@components";
import "./Feed.scss";

type FeedProps = {
  sort?: PostSortingOption;
  sortingOptions: readonly PostSortingOption[];
  sortTimeInterval?: SortTimeInterval;
  onSortChange?: (v: PostSortingOption) => void;
  onSortTimeIntervalChange?: (v: SortTimeInterval) => void;
  children: React.ReactNode;
};

export function Feed({
  sort = "hot",
  sortingOptions,
  sortTimeInterval = "day",
  onSortChange,
  onSortTimeIntervalChange,
  children,
}: FeedProps) {
  return (
    <div className="feed">
      <div className="feed__sort">
        <DropdownMenu
          button={(selectedContent) => (
            <DropdownButton color="clear" pill>
              {selectedContent}
            </DropdownButton>
          )}
          selectable
          value={sort}
          onItemClick={(value) => {
            if (isPostSortingOption(value)) onSortChange?.(value);
          }}
        >
          {sortingOptions.map((sort) => (
            <MenuItem key={sort} value={sort}>
              {capitalize(sort)}
            </MenuItem>
          ))}
        </DropdownMenu>
        {isSortRequiresTimeInterval(sort) && (
          <DropdownMenu
            button={(selectedContent) => (
              <DropdownButton color="clear" pill>
                {selectedContent}
              </DropdownButton>
            )}
            selectable
            value={sortTimeInterval}
            onItemClick={(value) => {
              if (isSortTimeInterval(value)) {
                onSortTimeIntervalChange?.(value);
              }
            }}
          >
            <MenuItem value="hour">Hour</MenuItem>
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </DropdownMenu>
        )}
      </div>
      {children}
    </div>
  );
}
