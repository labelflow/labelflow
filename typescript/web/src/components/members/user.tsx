import { Box, Stack, Badge, Flex, Avatar, chakra } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import * as React from "react";
import { RiUserLine } from "react-icons/ri";
import { GetMembershipsMembersQuery_memberships_user } from "../../graphql-types/GetMembershipsMembersQuery";
import { randomBackgroundGradient } from "../../utils/random-background-gradient";

const UserMenuIcon = chakra(RiUserLine);

export type UserProps = Partial<GetMembershipsMembersQuery_memberships_user>;

export const getDisplayName = ({ name, email, id }: UserProps) => {
  if (name) {
    return name;
  }
  if (email) {
    return email.split("@")[0];
  }
  if (id && id !== "local-user") {
    return `User - ${id.substr(id.length - 5, 4)}`;
  }
  return "";
};

export const User = (props: UserProps) => {
  const { id, image, email } = props;
  const session = useSession({ required: false });
  const loggedInUser = session.data?.user;
  const isLoggedInUser = loggedInUser?.id === id;
  const displayName = getDisplayName(props);

  return (
    <Stack direction="row" spacing="4" align="center">
      <Box flexShrink={0} h="10" w="10">
        <Avatar
          h="10"
          w="10"
          name={displayName}
          src={image ?? undefined}
          bg={
            displayName !== ""
              ? randomBackgroundGradient(displayName)
              : "gray.200"
          }
          icon={<UserMenuIcon />}
        />
      </Box>
      <Box>
        <Flex flexDirection="row">
          <Box fontSize="sm" fontWeight="medium">
            {displayName || "Anonymous"}
          </Box>

          {(isLoggedInUser || id === "local-user") && <Badge ml="2">You</Badge>}
        </Flex>
        {email && (
          <Box fontSize="sm" color="gray.500">
            {email}
          </Box>
        )}
      </Box>
    </Stack>
  );
};
