import React from "react";
import { useHistory } from "react-router-dom";
import { useAuth, getAuthURL } from "@services/auth";
import { useDarkMode } from "@context";
import { User } from "@types";

import { DropdownMenu, MenuItem, Avatar } from "@components";
import DownIcon from "@assets/svg/arrow-down.svg";
import UserIcon from "./assets/user.svg";
import MoonIcon from "./assets/moon.svg";
import SunIcon from "./assets/sun.svg";
import InIcon from "./assets/in.svg";
import OutIcon from "./assets/out.svg";
import "./UserMenu.scss";

type UserMenuProps = {
  user?: User;
};

export function UserMenu({ user }: UserMenuProps) {
  const { darkModeEnabled, toggleDarkMode } = useDarkMode();
  const { authorized, unauthorize } = useAuth();
  const history = useHistory();

  return (
    <DropdownMenu
      alignRight
      button={
        <button className="user-menu__button">
          <Avatar size="md" src={user?.avatar} />
          <DownIcon className="user-menu__button-icon" />
        </button>
      }
      size="lg"
    >
      {user && (
        <MenuItem
          leftIcon={<UserIcon className="user-menu__item-icon" />}
          onClick={() => history.push(`/user/${user.name}`)}
        >
          {user.name}
        </MenuItem>
      )}
      <MenuItem
        leftIcon={
          darkModeEnabled ? (
            <SunIcon className="user-menu__item-icon" />
          ) : (
            <MoonIcon className="user-menu__item-icon" />
          )
        }
        onClick={toggleDarkMode}
      >
        {darkModeEnabled ? "Light" : "Dark"} mode
      </MenuItem>
      {authorized ? (
        <MenuItem
          leftIcon={<OutIcon className="user-menu__item-icon" />}
          onClick={unauthorize}
        >
          Sign out
        </MenuItem>
      ) : (
        <MenuItem
          leftIcon={<InIcon className="user-menu__item-icon" />}
          onClick={() => location.assign(getAuthURL())}
        >
          Sign in with Reddit
        </MenuItem>
      )}
    </DropdownMenu>
  );
}
