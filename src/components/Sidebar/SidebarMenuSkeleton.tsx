import React from "react";

import { Skeleton } from "../Skeleton/Skeleton";
import "./Sidebar.scss";

export function SidebarMenuSkeleton({ count = 3 }: { count: number }) {
  return (
    <div className="sidebar-menu">
      {new Array(count).fill(0).map((v, i) => (
        <div key={i} className="sidebar-item">
          <div className="sidebar-item__icon">
            <Skeleton width={24} height={24} circle block />
          </div>
          <div className="sidebar-item__text">
            <Skeleton width={100} />
          </div>
        </div>
      ))}
    </div>
  );
}
