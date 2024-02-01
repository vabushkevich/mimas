import React from "react";
import { useSidebarSubreddits } from "./hooks";
import { useAuth } from "@services/auth";

import { Avatar, SidebarHeader } from "@components";
import { SidebarMenu } from "./SidebarMenu";
import { SidebarItem } from "./SidebarItem";
import { SidebarMenuSkeleton } from "./SidebarMenuSkeleton";
import FeedIcon from "./assets/feed.svg";
import TopIcon from "./assets/top.svg";
import GithubIcon from "./assets/github.svg";
import "./Sidebar.scss";

type SidebarProps = {
  showHeader?: boolean;
};

export function Sidebar({ showHeader = false }: SidebarProps) {
  const { authorized } = useAuth();
  const { data: subreddits, isLoading } = useSidebarSubreddits();

  return (
    <nav className="sidebar">
      {showHeader && (
        <div className="sidebar__header">
          <SidebarHeader />
        </div>
      )}
      <div className="sidebar__body">
        <div className="sidebar__menu">
          <SidebarMenu>
            {authorized && (
              <SidebarItem
                href="/"
                icon={<FeedIcon className="sidebar__item-icon" />}
              >
                My Feed
              </SidebarItem>
            )}
            <SidebarItem
              href={authorized ? "/r/all" : "/"}
              icon={<TopIcon className="sidebar__item-icon" />}
            >
              Popular
            </SidebarItem>
          </SidebarMenu>
        </div>
        {subreddits && (
          <div className="sidebar__menu">
            <SidebarMenu>
              {subreddits
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(({ avatar, name }) => (
                  <SidebarItem
                    key={name}
                    href={`/r/${name}`}
                    icon={<Avatar name={name} size="sm" src={avatar} />}
                  >
                    {name}
                  </SidebarItem>
                ))}
            </SidebarMenu>
          </div>
        )}
        {isLoading && <SidebarMenuSkeleton count={5} />}
      </div>
      <div className="sidebar__footer">
        <a // eslint-disable-line react/jsx-no-target-blank
          href="https://github.com/vabushkevich/mimas"
          target="_blank"
        >
          <GithubIcon className="sidebar__github-icon" />
        </a>
      </div>
    </nav>
  );
}
