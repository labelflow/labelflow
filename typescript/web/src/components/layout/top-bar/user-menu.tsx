import React from "react";

import {
  chakra,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  MenuGroup,
  useColorMode,
} from "@chakra-ui/react";

import { RiUserLine, RiMoonLine, RiSunLine } from "react-icons/ri";

const UserMenuIcon = chakra(RiUserLine);

const DarkModeIcon = chakra(RiMoonLine);
const LightModeIcon = chakra(RiSunLine);

export const UserMenu = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Menu>
      <Tooltip label="User and Preferences" openDelay={300}>
        <MenuButton
          as={IconButton}
          aria-label="User and Preferences"
          icon={<UserMenuIcon fontSize="xl" />}
          variant="ghost"
        />
      </Tooltip>
      <MenuList>
        <MenuGroup title="Preferences">
          {colorMode === "light" ? (
            <MenuItem
              icon={<DarkModeIcon fontSize="lg" />}
              onClick={toggleColorMode}
            >
              Switch to dark mode
            </MenuItem>
          ) : (
            <MenuItem
              icon={<LightModeIcon fontSize="lg" />}
              onClick={toggleColorMode}
            >
              Switch to light mode
            </MenuItem>
          )}
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};
