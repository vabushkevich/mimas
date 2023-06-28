import React from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "@services/auth";
import { useDarkMode } from "@context";
import { User } from "@types";

import { DropdownMenu, MenuItem, Avatar } from "@components";
import "./UserMenu.scss";

type UserMenuProps = {
  user: User;
};

export function UserMenu({ user }: UserMenuProps) {
  const { darkModeEnabled, toggleDarkMode } = useDarkMode();
  const { unauthorize } = useAuth();
  const history = useHistory();

  return (
    <DropdownMenu
      alignRight
      button={
        <button className="user-menu__button">
          <Avatar size="md" src={user.avatar} />
          <span className="user-menu__button-icon"></span>
        </button>
      }
      size="lg"
    >
      <MenuItem
        leftIcon={
          <span className="user-menu__item-icon user-menu__user-icon"></span>
        }
        onClick={() => history.push(`/user/${user.name}`)}
      >
        {user.name}
      </MenuItem>
      <MenuItem
        leftIcon={
          <span
            className={[
              "user-menu__item-icon",
              `user-menu__${darkModeEnabled ? "sun" : "moon"}-icon`,
            ].join(" ")}
          ></span>
        }
        onClick={toggleDarkMode}
      >
        {darkModeEnabled ? "Light" : "Dark"} mode
      </MenuItem>
      <MenuItem
        leftIcon={
          <span className="user-menu__item-icon user-menu__out-icon"></span>
        }
        onClick={unauthorize}
      >
        Sign Out
      </MenuItem>
    </DropdownMenu>
  );
}
