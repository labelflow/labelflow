import { useState, useEffect } from "react";
import {
  HStack,
  Avatar,
  Box,
  Button,
  Stack,
  StackDivider,
  Input,
} from "@chakra-ui/react";
import * as React from "react";
import { getDisplayName } from "../../members/user";
import { FieldGroup, HeadingGroup, Card } from "..";

export const Profile = ({
  user,
  changeUserName,
}: {
  user: { id: string; name?: string; image?: string };
  changeUserName: (name: string) => void;
}) => {
  const [userName, setUserName] = useState(getDisplayName(user));
  useEffect(() => setUserName(getDisplayName(user)), [getDisplayName(user)]);
  return (
    <>
      <HeadingGroup
        title="Account Settings"
        description="Change your profile"
      />
      <Card>
        <Stack divider={<StackDivider />} spacing="6">
          <FieldGroup title="Name &amp; Avatar" description="Change your name">
            <HStack spacing="4">
              <Avatar src={user?.image} name={getDisplayName(user)} />
              <Box>
                <Input
                  aria-label="Change username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Box>
            </HStack>
          </FieldGroup>
          <Box flexDirection="row" alignSelf="flex-end">
            <Button
              m="1"
              size="sm"
              fontWeight="normal"
              alignSelf="flex-end"
              disabled={userName === getDisplayName(user)}
              onClick={() => setUserName(getDisplayName(user))}
            >
              Cancel
            </Button>
            <Button
              m="1"
              mr="0"
              size="sm"
              alignSelf="flex-end"
              bg="brand.500"
              color="#FFFFFF"
              onClick={() => changeUserName(userName)}
              disabled={userName === getDisplayName(user)}
            >
              Save Changes
            </Button>
          </Box>
        </Stack>
      </Card>
    </>
  );
};
