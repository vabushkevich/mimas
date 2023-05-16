import React from "react";

import { Skeleton } from "@components";
import "./Sidebar.scss";

export function SidebarMenuSkeleton({ count = 3 }: { count: number }) {
  return (
    <ul className="sidebar__menu">
      {new Array(count).fill(0).map((v, i) => (
        <li key={i}>
          <div className="sidebar__item">
            <div className="sidebar__item-icon">
              <Skeleton width={24} height={24} circle block />
            </div>
            <div className="sidebar__item-text">
              <Skeleton width={100} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
