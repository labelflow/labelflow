import { Box, Stack, Badge, Flex, Avatar } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import * as React from "react";

interface UserProps {
  data: {
    id?: string;
    image?: string;
    name?: string;
    email?: string;
  };
}

export const getDisplayName = ({
  name,
  email,
  id,
}: {
  name?: string;
  email?: string;
  id?: string;
}) => {
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
  const {
    data: { id, image, name, email },
  } = props;
  const session = useSession({ required: false });
  const loggedInUser = session.data?.user;
  const isLoggedInUser = loggedInUser?.id === id;
  const displayName = getDisplayName({ name, email, id });
  return (
    <Stack direction="row" spacing="4" align="center">
      <Box flexShrink={0} h="10" w="10">
        <Avatar name={displayName} src={image} bg="brand.600" />
      </Box>
      <Box>
        <Flex flexDirection="row">
          <Box fontSize="sm" fontWeight="medium">
            {displayName}
          </Box>
          {isLoggedInUser || (id === "local-user" && <Badge>You</Badge>)}
        </Flex>
        <Box fontSize="sm" color="gray.500">
          {email}
        </Box>
      </Box>
    </Stack>
  );
};
