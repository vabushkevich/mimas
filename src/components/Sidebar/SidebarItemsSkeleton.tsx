import React from "react";

import { Skeleton } from "@components";
import "./Sidebar.scss";

export function SidebarItemsSkeleton({ count = 3 }) {
  return (
    <ul>
      {new Array(count).fill(0).map((v, i) => (
        <li key={i}>
          <div className="sidebar__item">
            <div className="sidebar__item-icon">
              <Skeleton width="100%" height="100%" circle block />
            </div>
            <div className="sidebar__item-text">
              <Skeleton width={100} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
