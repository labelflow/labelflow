import { useState, useEffect, useCallback } from "react";
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
import { SettingsContainer, FieldGroup, HeadingGroup, Card } from "..";

export const Profile = ({
  workspace,
  changeName,
  changeImage,
}: {
  workspace: { id: string; name?: string; image?: string };
  changeName: (name: string) => void;
  changeImage: (image: string) => void;
}) => {
  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [workspaceImagee, setWorkspaceImage] = useState(workspace.image);
  useEffect(() => setWorkspaceName(workspace.name), [workspace]);

  const handleImageUpload = useCallback(() => {}, []);

  const handleSubmit = useCallback(() => {}, []);

  return (
    <SettingsContainer>
      <HeadingGroup
        title="Account Settings"
        description="Change your profile"
      />
      <Card>
        <Stack divider={<StackDivider />} spacing="6">
          <FieldGroup title="Name &amp; Avatar" description="Change your name">
            <HStack spacing="4">
              <Avatar src={workspace?.image} name={workspace.name} />
              <Box>
                <Input
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
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
              disabled={workspaceName === workspace.name}
              onClick={() => setWorkspaceName(workspace.name)}
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
              onClick={() => changeName(workspaceName)}
              disabled={workspaceName === workspace.name}
            >
              Save Changes
            </Button>
          </Box>
        </Stack>
      </Card>
    </SettingsContainer>
  );
};
