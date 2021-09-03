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

import {
  RiUserLine,
  RiMoonLine,
  RiSunLine,
  RiLoginCircleLine,
  RiLogoutCircleRLine,
} from "react-icons/ri";
import { signOut, useSession, getSession } from "next-auth/client";
import { useQueryParam } from "use-query-params";
import { BoolParam } from "../../../utils/query-param-bool";

const UserMenuIcon = chakra(RiUserLine);

const DarkModeIcon = chakra(RiMoonLine);
const LightModeIcon = chakra(RiSunLine);

const SigninIcon = chakra(RiLoginCircleLine);
const SignoutIcon = chakra(RiLogoutCircleRLine);

export const UserMenu = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [session] = useSession();

  const [isSigninOpen, setIsSigninOpen] = useQueryParam(
    "modal-signin",
    BoolParam
  );

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
        <MenuGroup title="User">
          {/* {session ? ( */}
          <MenuItem
            icon={<SignoutIcon fontSize="lg" />}
            onClick={() => signOut()}
          >
            Sign out
          </MenuItem>
          {/* ) : ( */}
          <MenuItem
            icon={<SigninIcon fontSize="lg" />}
            onClick={() => setIsSigninOpen(true, "")}
          >
            Sign in
          </MenuItem>
          {/* )} */}
        </MenuGroup>
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
