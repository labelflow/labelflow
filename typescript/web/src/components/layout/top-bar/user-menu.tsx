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
  RiSettings4Line,
} from "react-icons/ri";
import { signOut, useSession } from "next-auth/react";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useQueryParam } from "use-query-params";
import { BoolParam } from "../../../utils/query-param-bool";
import { randomBackgroundGradient } from "../../../utils/random-background-gradient";
import { getDisplayName } from "../../members/user";

const UserMenuIcon = chakra(RiUserLine);

const DarkModeIcon = chakra(RiMoonLine);
const LightModeIcon = chakra(RiSunLine);

const SigninIcon = chakra(RiLoginCircleLine);
const SignoutIcon = chakra(RiLogoutCircleRLine);

const SettingsIcon = chakra(RiSettings4Line);

const userQuery = gql`
  query getUserProfileInfo($id: ID!) {
    user(where: { id: $id }) {
      id
      createdAt
      name
      email
      image
    }
  }
`;

export const UserMenu = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { data: session, status } = useSession({ required: false });

  const [, setIsSigninOpen] = useQueryParam("modal-signin", BoolParam);

  const userInfoFromSession = session?.user;

  const { data: userData } = useQuery(userQuery, {
    variables: { id: userInfoFromSession?.id },
    skip: userInfoFromSession?.id == null,
  });

  const user = userData?.user;

  const fadeColor = useColorModeValue("gray.600", "gray.400");
  const avatarBackground = useColorModeValue("white", "gray.700");

  const router = useRouter();

  const displayName = user != null ? getDisplayName(user) : "Anonymous";

  return (
    <Menu>
      <Tooltip label="User and Preferences" placement="left" openDelay={300}>
        <MenuButton
          as={IconButton}
          borderRadius="full"
          aria-label="User and Preferences"
          icon={
            session ? (
              <Avatar
                size="sm"
                bg={
                  user?.image != null && user?.image.length > 0
                    ? avatarBackground
                    : randomBackgroundGradient(displayName)
                }
                name={displayName}
                src={user?.image}
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
                  bg={
                    user?.image != null && user?.image.length > 0
                      ? avatarBackground
                      : randomBackgroundGradient(displayName)
                  }
                  name={displayName}
                  src={user?.image}
                />
                <Flex direction="column" fontWeight="medium">
                  <Text fontSize="sm">{displayName}</Text>
                  <Text fontSize="xs" lineHeight="shorter" color={fadeColor}>
                    {user?.email ?? ""}
                  </Text>
                </Flex>
              </HStack>
            </MenuItem>
            <MenuDivider />
          </>
        )}
        {process.env.NEXT_PUBLIC_FEATURE_SIGNIN === "true" && (
          <>
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
                <>
                  <MenuItem
                    icon={<SignoutIcon fontSize="lg" />}
                    onClick={() => signOut()}
                  >
                    Sign out
                  </MenuItem>
                  <MenuItem
                    icon={<SettingsIcon fontSize="lg" />}
                    onClick={() => {
                      router.push("/settings/profile");
                    }}
                  >
                    Settings
                  </MenuItem>
                </>
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
          </>
        )}
        <MenuGroup title="Preferences">
          {colorMode === "light" ? (
            <MenuItem
              icon={<DarkModeIcon fontSize="lg" />}
              closeOnSelect={false}
              onClick={toggleColorMode}
            >
              Switch to dark mode
            </MenuItem>
          ) : (
            <MenuItem
              icon={<LightModeIcon fontSize="lg" />}
              closeOnSelect={false}
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
