import { useQuery } from "@apollo/client";
import {
  Avatar,
  chakra,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuItemProps,
  MenuList,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { isEmpty, isNil } from "lodash/fp";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import {
  RiLoginCircleLine,
  RiLogoutCircleRLine,
  RiMoonLine,
  RiSettings4Line,
  RiSunLine,
  RiUserLine,
} from "react-icons/ri";
import { useQueryParam } from "use-query-params";
import {
  UserProfileQuery,
  UserProfileQueryVariables,
  UserProfileQuery_user,
} from "../../../graphql-types/UserProfileQuery";
import { USER_PROFILE_QUERY } from "../../../shared-queries/user-profile.query";
import { trackEvent } from "../../../utils/google-analytics";
import { BoolParam } from "../../../utils/query-param-bool";
import { randomBackgroundGradient } from "../../../utils/random-background-gradient";
import { getDisplayName } from "../../members/user";

const UserMenuIcon = chakra(RiUserLine);

const DarkModeIcon = chakra(RiMoonLine);
const LightModeIcon = chakra(RiSunLine);

const SigninIcon = chakra(RiLoginCircleLine);
const SignoutIcon = chakra(RiLogoutCircleRLine);

const SettingsIcon = chakra(RiSettings4Line);

type UserProps = UserProfileQuery_user & { displayName?: string };

const UserAvatar = ({ image, displayName }: UserProps) => {
  const avatarBackground = useColorModeValue("white", "gray.700");
  const bg = isEmpty(image)
    ? randomBackgroundGradient(displayName)
    : avatarBackground;
  return (
    <Avatar
      size="sm"
      bg={bg}
      name={displayName}
      src={image ?? undefined}
      icon={<UserMenuIcon fontSize="xl" />}
    />
  );
};

const ProfileMenuItem = (props: UserProps) => {
  const { displayName, email } = props;
  const fadeColor = useColorModeValue("gray.600", "gray.400");
  return (
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
        <UserAvatar {...props} />
        <Flex direction="column" fontWeight="medium">
          <Text fontSize="sm">{displayName}</Text>
          <Text fontSize="xs" lineHeight="shorter" color={fadeColor}>
            {email ?? ""}
          </Text>
        </Flex>
      </HStack>
    </MenuItem>
  );
};

const UserMenuButtonIcon = (props: UserProps) => {
  const { data: session } = useSession({ required: false });
  return session ? <UserAvatar {...props} /> : <UserMenuIcon fontSize="xl" />;
};

const UserMenuButton = (props: UserProps) => (
  <Tooltip label="User and Preferences" placement="left" openDelay={300}>
    <MenuButton
      as={IconButton}
      borderRadius="full"
      aria-label="User and Preferences"
      icon={<UserMenuButtonIcon {...props} />}
      variant="ghost"
    />
  </Tooltip>
);

const SignOutMenuItem = (props: MenuItemProps) => {
  const handleClick = useCallback(() => {
    trackEvent("signout", {});
    signOut({ callbackUrl: "/" });
  }, []);
  return (
    <MenuItem
      icon={<SignoutIcon fontSize="lg" />}
      onClick={handleClick}
      {...props}
    >
      Sign out
    </MenuItem>
  );
};

const SignInMenuItem = () => {
  const [, setIsSigninOpen] = useQueryParam("modal-signin", BoolParam);
  return (
    <MenuItem
      icon={<SigninIcon fontSize="lg" />}
      onClick={() => setIsSigninOpen(true, "replaceIn")}
    >
      Sign in
    </MenuItem>
  );
};

const SettingsMenuItem = () => {
  const router = useRouter();
  const handleClick = useCallback(
    () => router.push("/settings/profile"),
    [router]
  );
  return (
    <MenuItem icon={<SettingsIcon fontSize="lg" />} onClick={handleClick}>
      Settings
    </MenuItem>
  );
};

const UserMenuGroup = () => {
  const { status } = useSession({ required: false });
  return (
    <MenuGroup title="User">
      {status === "loading" && <SignOutMenuItem cursor="default" disabled />}
      {status === "authenticated" && (
        <>
          <SignOutMenuItem />
          <SettingsMenuItem />
        </>
      )}
      {status === "unauthenticated" && <SignInMenuItem />}
    </MenuGroup>
  );
};

const ColorModeIcon = () => {
  const { colorMode } = useColorMode();
  const iconFontSize = "lg";
  return colorMode === "light" ? (
    <LightModeIcon fontSize={iconFontSize} />
  ) : (
    <DarkModeIcon fontSize={iconFontSize} />
  );
};

const ColorModeLabel = () => {
  const { colorMode } = useColorMode();
  const newColorMode = colorMode === "light" ? "dark" : "light";
  return <>{`Switch to ${newColorMode} mode`}</>;
};

const ColorModeMenuItem = () => {
  const { toggleColorMode } = useColorMode();
  return (
    <MenuItem
      icon={<ColorModeIcon />}
      closeOnSelect={false}
      onClick={toggleColorMode}
    >
      <ColorModeLabel />
    </MenuItem>
  );
};

const PreferencesMenuGroup = () => (
  <MenuGroup title="Preferences">
    <ColorModeMenuItem />
  </MenuGroup>
);

const UserMenuList = (props: UserProps) => {
  const { data: session } = useSession({ required: false });
  return (
    <MenuList>
      {session && (
        <>
          <ProfileMenuItem {...props} />
          <MenuDivider />
        </>
      )}
      <UserMenuGroup />
      <MenuDivider />
      <PreferencesMenuGroup />
    </MenuList>
  );
};

const useUser = (): UserProps | undefined => {
  const { data: session } = useSession({ required: false });
  const userInfoFromSession = session?.user;
  const { data: userData } = useQuery<
    UserProfileQuery,
    UserProfileQueryVariables
  >(USER_PROFILE_QUERY, {
    variables: { id: userInfoFromSession?.id ?? "" },
    skip: isNil(userInfoFromSession?.id),
  });
  const user = userData?.user;
  return isNil(user)
    ? undefined
    : { ...user, displayName: getDisplayName(user) };
};

export const UserMenu = () => {
  const user = useUser();
  return (
    <>
      {user && (
        <Menu>
          <UserMenuButton {...user} />
          <UserMenuList {...user} />
        </Menu>
      )}
    </>
  );
};
