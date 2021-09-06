import React from "react";

import {
  chakra,
  IconButton,
  Menu,
  MenuButton,
  Text,
  MenuDivider,
  MenuList,
  MenuItem,
  Tooltip,
  MenuGroup,
  useColorMode,
  Avatar,
  Flex,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  RiUserLine,
  RiMoonLine,
  RiSunLine,
  RiLoginCircleLine,
  RiLogoutCircleRLine,
} from "react-icons/ri";
import { signOut, useSession } from "next-auth/react";
import { useQueryParam } from "use-query-params";
import { BoolParam } from "../../../utils/query-param-bool";

const UserMenuIcon = chakra(RiUserLine);

const DarkModeIcon = chakra(RiMoonLine);
const LightModeIcon = chakra(RiSunLine);

const SigninIcon = chakra(RiLoginCircleLine);
const SignoutIcon = chakra(RiLogoutCircleRLine);

export const UserMenu = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { data: session, status } = useSession({ required: false });

  const [, setIsSigninOpen] = useQueryParam("modal-signin", BoolParam);

  const fadeColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Menu>
      <Tooltip label="User and Preferences" openDelay={300}>
        <MenuButton
          as={IconButton}
          borderRadius="full"
          aria-label="User and Preferences"
          icon={
            session ? (
              <Avatar
                size="sm"
                name={session?.user?.name}
                src={session?.user?.image}
                icon={<UserMenuIcon fontSize="xl" />}
              />
            ) : (
              <UserMenuIcon fontSize="xl" />
            )
          }
          variant="ghost"
        />
      </Tooltip>
      <MenuList>
        {session && (
          <>
            <MenuItem
              disabled
              sx={{
                cursor: "default",
                ":hover": { background: "none" },
                ":active": { background: "none" },
                ":focus": { background: "none" },
              }}
              display="flex"
              flexDirection="column"
              padding="4"
            >
              <HStack spacing="4" flexShrink={0}>
                <Avatar
                  size="sm"
                  name={session?.user?.name}
                  src={session?.user?.image}
                />
                <Flex direction="column" fontWeight="medium">
                  <Text fontSize="sm">
                    {session?.user?.name ?? "Anonymous"}
                  </Text>
                  <Text fontSize="xs" lineHeight="shorter" color={fadeColor}>
                    {session?.user?.email ?? ""}
                  </Text>
                </Flex>
              </HStack>
            </MenuItem>
            <MenuDivider />
          </>
        )}
        <MenuGroup title="User">
          {status === "loading" && (
            <MenuItem
              cursor="default"
              disabled
              icon={<SignoutIcon fontSize="lg" />}
            >
              Sign out
            </MenuItem>
          )}
          {status === "authenticated" && (
            <MenuItem
              icon={<SignoutIcon fontSize="lg" />}
              onClick={() => signOut()}
            >
              Sign out
            </MenuItem>
          )}
          {status === "unauthenticated" && (
            <MenuItem
              icon={<SigninIcon fontSize="lg" />}
              onClick={() => setIsSigninOpen(true, "replaceIn")}
            >
              Sign in
            </MenuItem>
          )}
        </MenuGroup>
        <MenuDivider />
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
