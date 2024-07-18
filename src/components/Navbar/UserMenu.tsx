import React from "react";
import { useAuth } from "@services/auth";
import { useDarkMode } from "@context";
import { User } from "@types";

import { Avatar, Menu, MenuItem, MenuItemLink } from "@components";
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
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { authorized, signIn, signOut } = useAuth();

  return (
    <Menu
      alignRight
      renderButton={(props) => (
        <button {...props} className="user-menu__button">
          <Avatar size="md" src={user?.avatar} />
          <DownIcon className="user-menu__button-icon" />
        </button>
      )}
      size="lg"
    >
      {user && (
        <MenuItemLink href={`/user/${user.name}`} leftIcon={<UserIcon />}>
          {user.name}
        </MenuItemLink>
      )}
      <MenuItem
        closeOnSelect={false}
        leftIcon={isDarkMode ? <SunIcon /> : <MoonIcon />}
        onSelect={toggleDarkMode}
      >
        {isDarkMode ? "Light" : "Dark"} mode
      </MenuItem>
      {authorized ? (
        <MenuItem leftIcon={<OutIcon />} onSelect={signOut}>
          Sign out
        </MenuItem>
      ) : (
        <MenuItem leftIcon={<InIcon />} onSelect={signIn}>
          Sign in with Reddit
        </MenuItem>
      )}
    </Menu>
  );
}
